import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import {
  Layers,
  Maximize2,
  Minimize2,
  Plus,
  Minus,
  LocateFixed,
  Navigation,
  X,
  MapPin
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

// Google Maps type mapping from app mapType values
const toGoogleMapType = (mapType, google) => {
  switch (mapType) {
    case 'satellite': return google.maps.MapTypeId.SATELLITE;
    case 'hybrid':    return google.maps.MapTypeId.HYBRID;
    case 'map':
    default:          return google.maps.MapTypeId.ROADMAP;
  }
};

export default function GoogleMapView() {
  const {
    activeParcel,
    selectParcel,
    mapType,
    setMapType,
    isFullscreen,
    setIsFullscreen,
    layers,
    toggleLayer,
    layersDrawerOpen,
    setLayersDrawerOpen,
    locationParcels,
    currentLocation,
    showLocationToast,
    locationToast
  } = useApp();

  const mapRef = useRef(null);
  const googleMapRef = useRef(null);  // persistent ref so effects can always access latest map
  const polygonRefs = useRef([]);     // [{id, poly, landUse}]
  const boundaryRefs = useRef([]);
  const utilityRefs = useRef([]);
  const protectedRefs = useRef([]);
  const loaderRef = useRef(null);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [apiError, setApiError] = useState(false);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  const getZoningColor = (landUse) => {
    if (!landUse) return '#0f172a';
    const lu = String(landUse).toLowerCase();
    if (lu.includes('commercial')) return '#a855f7';
    if (lu.includes('residential')) return '#eab308';
    if (lu.includes('agri')) return '#10b981';
    if (lu.includes('indus')) return '#6366f1';
    if (lu.includes('instit')) return '#06b6d4';
    return '#0f172a';
  };

  // ─── 1. Initialize Google Maps once ──────────────────────────────────────
  useEffect(() => {
    if (!apiKey || apiKey.trim() === '') {
      setApiError(true);
      return;
    }

    if (loaderRef.current) return; // already initializing

    const loader = new Loader({
      apiKey: apiKey,
      version: 'weekly',
      libraries: ['places', 'geometry']
    });

    loaderRef.current = loader;

    loader
      .load()
      .then((google) => {
        if (!mapRef.current) return;

        // Wait a tick so container has painted real dimensions
        requestAnimationFrame(() => {
          const loc = currentLocation || { lat: 30.7398, lng: 76.7820, zoom: 17 };

          const map = new google.maps.Map(mapRef.current, {
            center: { lat: loc.lat, lng: loc.lng },
            zoom: loc.zoom || 17,
            mapTypeId: toGoogleMapType(mapType, google),
            disableDefaultUI: true,
            zoomControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            gestureHandling: 'greedy'
          });

          googleMapRef.current = map;
          setMapLoaded(true);
        });
      })
      .catch((err) => {
        console.warn('Google Maps failed to load:', err);
        setApiError(true);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey]);

  // ─── 2. Draw / Redraw Cadastral Vector Overlay when map or parcels change ─
  useEffect(() => {
    if (!mapLoaded || !googleMapRef.current || !window.google) return;

    const google = window.google;
    const map = googleMapRef.current;

    // Remove old polygons and labels cleanly
    polygonRefs.current.forEach(({ poly }) => {
      if (poly._label) poly._label.setMap(null);
      if (window.google?.maps?.event) {
        window.google.maps.event.clearInstanceListeners(poly);
      }
      poly.setMap(null);
    });
    polygonRefs.current = [];

    if (!layers.parcels) return;

    const created = locationParcels
      .filter(p => p.polygon && p.polygon.length > 2)
      .map((parcel) => {
        const isSelected = activeParcel && parcel.parcel_id === activeParcel.parcel_id;
        const defaultFill = layers.zoning ? getZoningColor(parcel.land_use) : '#0f172a';
        const defaultOpacity = layers.zoning ? 0.35 : 0.22;

        const poly = new google.maps.Polygon({
          paths: parcel.polygon,
          strokeColor:   isSelected ? '#38bdf8' : (layers.zoning ? getZoningColor(parcel.land_use) : 'rgba(255,255,255,0.6)'),
          strokeOpacity: 0.9,
          strokeWeight:  isSelected ? 3.5 : 1.2,
          fillColor:     isSelected ? '#0284c7' : defaultFill,
          fillOpacity:   isSelected ? 0.38 : defaultOpacity,
          map,
          zIndex:        isSelected ? 10 : 1,
          clickable:     true
        });

        poly.addListener('click', () => {
          selectParcel(parcel.parcel_id);
        });

        // Compact parcel ID label using a transparent Marker with text label
        if (layers.labels) {
          const bounds = new google.maps.LatLngBounds();
          parcel.polygon.forEach(pt => bounds.extend(pt));
          const center = bounds.getCenter();

          // Use a Marker with label — cleaner than InfoWindow (no close button)
          const labelMarker = new google.maps.Marker({
            position: center,
            map: isSelected ? map : null,
            label: {
              text: parcel.parcel_id,
              color: '#ffffff',
              fontSize: '10px',
              fontWeight: '700',
              fontFamily: 'system-ui, sans-serif'
            },
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 0,
              fillOpacity: 0,
              strokeOpacity: 0
            },
            clickable: false,
            zIndex: 20
          });

          poly._label = labelMarker;
          poly._isSelectedLabel = isSelected;
        }

        return { id: parcel.parcel_id, poly, landUse: parcel.land_use };
      });

    polygonRefs.current = created;

    return () => {
      created.forEach(({ poly }) => {
        if (poly._label) poly._label.setMap(null);
        if (window.google?.maps?.event) {
          window.google.maps.event.clearInstanceListeners(poly);
        }
        poly.setMap(null);
      });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapLoaded, locationParcels, layers.parcels, layers.labels, layers.zoning]);

  // ─── 3. Update polygon selection styling when activeParcel changes ─────────
  useEffect(() => {
    if (!mapLoaded || !window.google) return;

    polygonRefs.current.forEach(({ id, poly, landUse }) => {
      const isSelected = activeParcel && id === activeParcel.parcel_id;
      const defaultFill = layers.zoning ? getZoningColor(landUse) : '#0f172a';
      const defaultOpacity = layers.zoning ? 0.35 : 0.22;

      poly.setOptions({
        strokeColor:   isSelected ? '#38bdf8' : (layers.zoning ? getZoningColor(landUse) : 'rgba(255,255,255,0.6)'),
        strokeWeight:  isSelected ? 3.5 : 1.2,
        fillColor:     isSelected ? '#0284c7' : defaultFill,
        fillOpacity:   isSelected ? 0.38 : defaultOpacity,
        zIndex:        isSelected ? 10 : 1
      });

      // Update labels — Marker uses setMap, not open/close
      if (poly._label) {
        if (isSelected) {
          poly._label.setMap(googleMapRef.current);
          poly._isSelectedLabel = true;
        } else if (poly._isSelectedLabel) {
          poly._label.setMap(null);
          poly._isSelectedLabel = false;
        }
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeParcel, mapLoaded, layers.zoning]);

  // ─── 3B. Boundary Overlays ───────────────────────────────────────────────
  useEffect(() => {
    if (!mapLoaded || !googleMapRef.current || !window.google) return;
    const google = window.google;
    const map = googleMapRef.current;

    boundaryRefs.current.forEach(item => item.setMap(null));
    boundaryRefs.current = [];

    if (!layers.boundaries || !locationParcels || locationParcels.length === 0) return;

    const bounds = new google.maps.LatLngBounds();
    locationParcels.forEach(p => {
      if (p.polygon) p.polygon.forEach(pt => bounds.extend(pt));
    });

    if (bounds.isEmpty()) return;
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    const padLat = (ne.lat() - sw.lat()) * 0.12 || 0.001;
    const padLng = (ne.lng() - sw.lng()) * 0.12 || 0.001;

    const boundaryPoly = new google.maps.Polygon({
      paths: [
        { lat: sw.lat() - padLat, lng: sw.lng() - padLng },
        { lat: ne.lat() + padLat, lng: sw.lng() - padLng },
        { lat: ne.lat() + padLat, lng: ne.lng() + padLng },
        { lat: sw.lat() - padLat, lng: ne.lng() + padLng }
      ],
      strokeColor: '#ef4444',
      strokeOpacity: 0.85,
      strokeWeight: 2.5,
      fillColor: '#ef4444',
      fillOpacity: 0.04,
      map,
      clickable: false,
      zIndex: 2
    });

    boundaryRefs.current = [boundaryPoly];
  }, [mapLoaded, locationParcels, layers.boundaries]);

  // ─── 3C. Civic Utilities Network Overlays ─────────────────────────────────
  useEffect(() => {
    if (!mapLoaded || !googleMapRef.current || !window.google) return;
    const google = window.google;
    const map = googleMapRef.current;

    utilityRefs.current.forEach(item => item.setMap(null));
    utilityRefs.current = [];

    if (!layers.utilities || !locationParcels || locationParcels.length === 0) return;

    const points = [];
    locationParcels.forEach(p => {
      if (p.polygon && p.polygon.length > 0) {
        points.push(p.polygon[0]);
      }
    });

    if (points.length >= 2) {
      const line = new google.maps.Polyline({
        path: points,
        strokeColor: '#f97316',
        strokeOpacity: 0.9,
        strokeWeight: 3,
        map,
        clickable: false,
        zIndex: 5
      });
      utilityRefs.current = [line];
    }
  }, [mapLoaded, locationParcels, layers.utilities]);

  // ─── 3D. Protected Environmental Buffers ─────────────────────────────────
  useEffect(() => {
    if (!mapLoaded || !googleMapRef.current || !window.google) return;
    const google = window.google;
    const map = googleMapRef.current;

    protectedRefs.current.forEach(item => item.setMap(null));
    protectedRefs.current = [];

    if (!layers.protected || !locationParcels || locationParcels.length === 0) return;

    const bounds = new google.maps.LatLngBounds();
    locationParcels.forEach(p => {
      if (p.polygon) p.polygon.forEach(pt => bounds.extend(pt));
    });
    if (bounds.isEmpty()) return;
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();
    const height = ne.lat() - sw.lat();

    const bufferPoly = new google.maps.Polygon({
      paths: [
        { lat: ne.lat() - height * 0.1, lng: sw.lng() },
        { lat: ne.lat() + height * 0.35, lng: sw.lng() },
        { lat: ne.lat() + height * 0.35, lng: ne.lng() },
        { lat: ne.lat() - height * 0.1, lng: ne.lng() }
      ],
      strokeColor: '#10b981',
      strokeOpacity: 0.85,
      strokeWeight: 2,
      fillColor: '#10b981',
      fillOpacity: 0.22,
      map,
      clickable: false,
      zIndex: 3
    });

    protectedRefs.current = [bufferPoly];
  }, [mapLoaded, locationParcels, layers.protected]);

  // ─── 4. Move map when location changes ───────────────────────────────────
  useEffect(() => {
    if (!mapLoaded || !googleMapRef.current || !currentLocation) return;

    googleMapRef.current.panTo({ lat: currentLocation.lat, lng: currentLocation.lng });
    googleMapRef.current.setZoom(currentLocation.zoom || 17);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLocation?.id, mapLoaded]);

  // ─── 5. Update map type when mapType state changes ─────────────────────────
  useEffect(() => {
    if (!mapLoaded || !googleMapRef.current || !window.google) return;
    googleMapRef.current.setMapTypeId(toGoogleMapType(mapType, window.google));
  }, [mapType, mapLoaded]);

  // ─── 6. Trigger resize when fullscreen toggles ───────────────────────────
  useEffect(() => {
    if (!mapLoaded || !googleMapRef.current || !window.google) return;
    setTimeout(() => {
      window.google.maps.event.trigger(googleMapRef.current, 'resize');
      if (currentLocation) {
        googleMapRef.current.setCenter({ lat: currentLocation.lat, lng: currentLocation.lng });
      }
    }, 100);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFullscreen, mapLoaded]);

  // ─── Handlers ────────────────────────────────────────────────────────────
  const handleZoomIn = useCallback(() => {
    if (googleMapRef.current) {
      googleMapRef.current.setZoom(googleMapRef.current.getZoom() + 1);
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if (googleMapRef.current) {
      googleMapRef.current.setZoom(Math.max(googleMapRef.current.getZoom() - 1, 3));
    }
  }, []);

  const handleReset = useCallback(() => {
    if (!googleMapRef.current || !currentLocation) return;
    googleMapRef.current.panTo({ lat: currentLocation.lat, lng: currentLocation.lng });
    googleMapRef.current.setZoom(currentLocation.zoom || 17);
    if (currentLocation.defaultParcelId) {
      selectParcel(currentLocation.defaultParcelId);
    }
  }, [currentLocation, selectParcel]);

  const handleLocate = useCallback(() => {
    if (!navigator.geolocation) {
      showLocationToast('Geolocation is not supported by your browser.', 'error');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (googleMapRef.current) {
          const { latitude: lat, longitude: lng } = pos.coords;
          googleMapRef.current.panTo({ lat, lng });
          googleMapRef.current.setZoom(16);
          showLocationToast('Map centered on your location.', 'info');
        }
      },
      (err) => {
        let msg = 'Could not get your location.';
        if (err.code === 1) msg = 'Location access denied.';
        showLocationToast(msg, 'error');
      },
      { timeout: 8000 }
    );
  }, [showLocationToast]);

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div
      className={`map-wrapper ${isFullscreen ? 'fullscreen-mode' : ''}`}
      id="land-explorer-gis-workspace"
      style={isFullscreen ? { position: 'fixed', inset: 0, zIndex: 9999, borderRadius: 0 } : {}}
    >
      <div className="map-canvas-container">

        {/* ── Google Maps container (always rendered so ref attaches) ── */}
        <div
          ref={mapRef}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            display: (!apiKey || apiError) ? 'none' : 'block'
          }}
        />

        {/* ── Error / No-Key state ── */}
        {(!apiKey || apiError) && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            background: 'var(--bg-main)', gap: '12px'
          }}>
            <MapPin size={32} color="var(--brand-accent-blue)" />
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
              {!apiKey ? 'Google Maps API key not configured.' : 'Google Maps could not be loaded.'}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', maxWidth: '280px', textAlign: 'center' }}>
              {!apiKey
                ? 'Set VITE_GOOGLE_MAPS_API_KEY in your .env file and restart the dev server.'
                : 'Check your API key, browser console, and network connection.'}
            </div>
          </div>
        )}

        {/* ── SVG Cadastral overlay (shown over Google Maps when map not loaded yet / loading) ── */}
        {/* This is intentionally empty – cadastral is drawn as Google Maps Polygons above ──── */}

        {/* ── Location Toast ── */}
        {locationToast && (
          <div style={{
            position: 'absolute', bottom: '48px', left: '50%', transform: 'translateX(-50%)',
            background: locationToast.type === 'error' ? 'rgba(239,68,68,0.9)' : 'rgba(2,132,199,0.9)',
            color: '#fff', fontSize: '11.5px', fontWeight: 600,
            padding: '6px 14px', borderRadius: '20px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
            zIndex: 500, whiteSpace: 'nowrap', pointerEvents: 'none'
          }}>
            {locationToast.message}
          </div>
        )}

        {/* ── Floating Top Left Pill ── */}
        <div className="map-pill-top-left">
          <span>Cadastral Parcels</span>
          <X size={12} style={{ cursor: 'pointer' }} onClick={() => toggleLayer('parcels')} />
        </div>

        {/* ── Basemap Switcher Pills ── */}
        <div className="map-basemap-toggle">
          <button
            className={`basemap-btn ${mapType === 'map' ? 'active' : ''}`}
            onClick={() => setMapType('map')}
          >
            Map
          </button>
          <button
            className={`basemap-btn ${mapType === 'satellite' ? 'active' : ''}`}
            onClick={() => setMapType('satellite')}
          >
            Satellite
          </button>
          <button
            className={`basemap-btn ${mapType === 'hybrid' ? 'active' : ''}`}
            onClick={() => setMapType('hybrid')}
          >
            Hybrid
          </button>
        </div>

        {/* ── Right Floating Toolbar ── */}
        <div className="map-toolbar">
          <button
            className="map-tool-btn"
            onClick={() => setLayersDrawerOpen(!layersDrawerOpen)}
            title="Toggle Layers"
          >
            <Layers size={16} />
          </button>
          <button
            className="map-tool-btn"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          <button className="map-tool-btn" onClick={handleZoomIn} title="Zoom In">
            <Plus size={16} />
          </button>
          <button className="map-tool-btn" onClick={handleZoomOut} title="Zoom Out">
            <Minus size={16} />
          </button>
          <button
            className="map-tool-btn"
            onClick={handleReset}
            title="Reset to Location Default"
          >
            <Navigation size={16} />
          </button>
          <button
            className="map-tool-btn"
            onClick={handleLocate}
            title="Locate Me (device GPS)"
          >
            <LocateFixed size={16} />
          </button>
        </div>

        {/* ── Layers Drawer ── */}
        {layersDrawerOpen && (
          <div className="map-layers-drawer">
            <div className="layer-drawer-header">
              <span>Layers</span>
              <X size={14} style={{ cursor: 'pointer' }} onClick={() => setLayersDrawerOpen(false)} />
            </div>

            <div className="layer-group-title">Base Map</div>
            <label className="layer-checkbox-item">
              <input
                type="radio"
                name="basemap-radio"
                checked={mapType === 'satellite'}
                onChange={() => setMapType('satellite')}
              />
              <span>Satellite (Default)</span>
            </label>
            <label className="layer-checkbox-item">
              <input
                type="radio"
                name="basemap-radio"
                checked={mapType === 'map'}
                onChange={() => setMapType('map')}
              />
              <span>Roadmap</span>
            </label>
            <label className="layer-checkbox-item">
              <input
                type="radio"
                name="basemap-radio"
                checked={mapType === 'hybrid'}
                onChange={() => setMapType('hybrid')}
              />
              <span>Hybrid</span>
            </label>

            <div className="layer-group-title">Cadastral &amp; Parcels</div>
            <label className="layer-checkbox-item">
              <input
                type="checkbox"
                checked={layers.parcels}
                onChange={() => toggleLayer('parcels')}
              />
              <span>Parcel Boundaries</span>
            </label>
            <label className="layer-checkbox-item">
              <input
                type="checkbox"
                checked={layers.labels}
                onChange={() => toggleLayer('labels')}
              />
              <span>Parcel Labels</span>
            </label>

            <div className="layer-group-title">Planning &amp; Zoning</div>
            <label className="layer-checkbox-item">
              <input
                type="checkbox"
                checked={layers.zoning}
                onChange={() => toggleLayer('zoning')}
              />
              <span>Master Plan Zones</span>
            </label>
            <label className="layer-checkbox-item">
              <input
                type="checkbox"
                checked={layers.boundaries}
                onChange={() => toggleLayer('boundaries')}
              />
              <span>Administrative Boundaries</span>
            </label>

            <div className="layer-group-title">Other Layers</div>
            <label className="layer-checkbox-item">
              <input
                type="checkbox"
                checked={layers.utilities}
                onChange={() => toggleLayer('utilities')}
              />
              <span>Utilities Network</span>
            </label>
            <label className="layer-checkbox-item">
              <input
                type="checkbox"
                checked={layers.protected}
                onChange={() => toggleLayer('protected')}
              />
              <span>Heritage / Protected</span>
            </label>
          </div>
        )}

        {/* ── Legend ── */}
        <div className="map-legend">
          <div className="legend-title">Legend</div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: 'var(--brand-accent-blue)', border: '1px solid #38bdf8' }} />
            <span>Selected Parcel</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: 'rgba(15,23,42,0.5)', border: '1px solid rgba(255,255,255,0.4)' }} />
            <span>Cadastral Boundary</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#22c55e' }} />
            <span>Green Belt</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#a855f7' }} />
            <span>Commercial Zone</span>
          </div>
        </div>

        {/* ── Scale Bar ── */}
        <div className="map-scale">
          <span>0</span>
          <div className="scale-ruler" />
          <span>200 m</span>
        </div>
      </div>
    </div>
  );
}
