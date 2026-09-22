"""
PLOT360 Backend — Geospatial Utilities & PostGIS/Shapely Abstraction
Handles GeoJSON interchange, area calculations in metric projection,
and dual PostGIS / Shapely fallback.
"""
import json
import math
from typing import Optional, Dict, Any, List, Tuple
from shapely.geometry import shape, mapping, Polygon, Point
from shapely.ops import transform
import pyproj
from sqlalchemy import Column, Text
from geoalchemy2 import Geometry

from app.database import is_postgis_active


def get_geometry_column(geom_type: str = "POLYGON", srid: int = 4326):
    """Returns GeoAlchemy2 Geometry for PostGIS or Text for SQLite fallback."""
    if is_postgis_active():
        return Column(Geometry(geom_type, srid=srid), nullable=True)
    else:
        # Store as GeoJSON or WKT string in SQLite
        return Column(Text, nullable=True)


def coords_to_geojson_polygon(coords: List[Dict[str, float]]) -> Dict[str, Any]:
    """Convert [{lat: ..., lng: ...}, ...] to GeoJSON Polygon dict."""
    if not coords or len(coords) < 3:
        return None
    ring = [[c["lng"], c["lat"]] for c in coords]
    # Ensure closed ring
    if ring[0] != ring[-1]:
        ring.append(ring[0])
    return {
        "type": "Polygon",
        "coordinates": [ring]
    }


def geojson_to_shapely(geojson_obj: Any) -> Optional[Polygon]:
    """Convert GeoJSON dict or string to Shapely geometry."""
    if not geojson_obj:
        return None
    try:
        if isinstance(geojson_obj, str):
            geojson_obj = json.loads(geojson_obj)
        return shape(geojson_obj)
    except Exception:
        return None


def calculate_accurate_area_sqm(geom: Any) -> float:
    """
    Calculate accurate geodesic / projected area in square meters.
    CRITICAL: Does NOT calculate area directly from raw lat/long degrees.
    Uses UTM or equal-area projection based on centroid.
    """
    if geom is None:
        return 0.0
    shapely_geom = geojson_to_shapely(geom) if not isinstance(geom, (Polygon,)) else geom
    if not shapely_geom or shapely_geom.is_empty:
        return 0.0

    try:
        centroid = shapely_geom.centroid
        lon, lat = centroid.x, centroid.y
        # Compute UTM zone
        utm_zone = int(math.floor((lon + 180) / 6) + 1)
        epsg_code = 32600 + utm_zone if lat >= 0 else 32700 + utm_zone
        wgs84 = pyproj.CRS("EPSG:4326")
        utm = pyproj.CRS(f"EPSG:{epsg_code}")
        project = pyproj.Transformer.from_crs(wgs84, utm, always_xy=True).transform
        projected_geom = transform(project, shapely_geom)
        return round(float(projected_geom.area), 2)
    except Exception:
        # Fallback approximation: 1 deg lat ~ 111,320m, 1 deg lon ~ 111,320*cos(lat)
        try:
            c = shapely_geom.centroid
            lat_rad = math.radians(c.y)
            m_per_deg_lat = 111320.0
            m_per_deg_lon = 111320.0 * math.cos(lat_rad)
            coords = list(shapely_geom.exterior.coords)
            projected_coords = [(x * m_per_deg_lon, y * m_per_deg_lat) for x, y in coords]
            return round(float(Polygon(projected_coords).area), 2)
        except Exception:
            return 0.0


def point_in_polygon(lat: float, lng: float, polygon_geojson: Any) -> bool:
    """Check if point (lat, lng) is within polygon."""
    poly = geojson_to_shapely(polygon_geojson)
    if not poly:
        return False
    pt = Point(lng, lat)
    return poly.contains(pt) or poly.intersects(pt)


def polygons_intersect(geom1: Any, geom2: Any) -> Tuple[bool, float, Optional[Dict[str, Any]]]:
    """
    Check if two geometries intersect.
    Returns (intersects, intersection_area_sqm, intersection_geojson).
    """
    s1 = geojson_to_shapely(geom1)
    s2 = geojson_to_shapely(geom2)
    if not s1 or not s2:
        return False, 0.0, None
    if not s1.intersects(s2):
        return False, 0.0, None

    intersection = s1.intersection(s2)
    if intersection.is_empty:
        return False, 0.0, None

    area_sqm = calculate_accurate_area_sqm(intersection)
    return True, area_sqm, mapping(intersection)
