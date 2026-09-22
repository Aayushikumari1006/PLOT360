"""
PLOT360 Backend — Sentinel-2 Dataset Integration Test Suite
Sections 37 & 38: Complete 22 automated tests covering path resolution,
lightweight header inspection, streaming SHA-256, temporal pairing, missing observation handling,
test-file classification, mask auditing, manifest generation, deterministic fingerprinting,
idempotent database registration, source immutability, AI APIs, and health reporting.
"""
import os
import json
import hashlib
import tempfile
import numpy as np
import pytest
import rasterio
from rasterio.transform import from_origin
from sqlalchemy.orm import Session

from app.config import settings
from app.ml.dataset import (
    calculate_file_sha256,
    inspect_geotiff,
    parse_raster_filename,
    scan_and_validate_sentinel_dataset,
    register_dataset_in_db,
    DATASET_VERSION
)
from app.models.ai_models import AIDataset, SatelliteObservation, TemporalPair


@pytest.fixture
def synthetic_geotiff_dir(tmp_path):
    """Creates a small mock Sentinel-2 dataset with 2 regions (paired 2020 & 2025)."""
    d = tmp_path / "mock_sentinel"
    d.mkdir()

    transform = from_origin(500000.0, 3400000.0, 10.0, 10.0)
    crs = "EPSG:32643"
    band_names = ["B2", "B3", "B4", "B8", "B11", "B12"]

    for reg in ["AGR_01", "URB_01"]:
        for year in [2020, 2025]:
            fname = f"PLOT360_{reg}_{year}.tif"
            fpath = d / fname
            data = (np.ones((6, 20, 20), dtype=np.float32) * (year / 2025.0))
            with rasterio.open(
                fpath,
                "w",
                driver="GTiff",
                height=20,
                width=20,
                count=6,
                dtype="float32",
                crs=crs,
                transform=transform,
                nodata=-9999.0
            ) as dst:
                dst.write(data)
                for i, name in enumerate(band_names, 1):
                    dst.set_band_description(i, name)

    return str(d)


# Test 1: Source directory resolution from project root
def test_source_directory_resolution():
    res = settings.resolve_sentinel_dir()
    assert os.path.exists(res), f"Resolved Sentinel dir should exist: {res}"
    assert "PLOT360_Sentinel2_2020_2025" in res


# Test 2: Environment variable override
def test_environment_variable_override(monkeypatch, tmp_path):
    custom_dir = tmp_path / "custom_sentinel"
    custom_dir.mkdir()
    monkeypatch.setattr(settings, "SENTINEL_DATA_DIR", str(custom_dir))
    resolved = settings.resolve_sentinel_dir()
    assert resolved == str(custom_dir.resolve())


# Test 3: Missing source directory produces structured error
def test_missing_source_directory_error(tmp_path):
    non_existent = str(tmp_path / "non_existent_folder_xyz")
    res = scan_and_validate_sentinel_dataset(source_dir=non_existent, generate_manifest=False)
    assert res["status"] == "ERROR"
    assert res["source_available"] is False
    assert len(res["errors"]) > 0


# Test 4: Real/synthetic TIFF header inspection
def test_geotiff_header_inspection(synthetic_geotiff_dir):
    sample_file = os.path.join(synthetic_geotiff_dir, "PLOT360_AGR_01_2020.tif")
    meta = inspect_geotiff(sample_file)
    assert meta["exists"] is True
    assert meta["is_valid"] is True
    assert meta["width"] == 20
    assert meta["height"] == 20
    assert meta["count"] == 6
    assert meta["crs"] == "EPSG:32643"
    assert meta["pixel_size"] == [10.0, 10.0]
    assert len(meta["band_descriptions"]) == 6
    assert meta["band_descriptions"] == ["B2", "B3", "B4", "B8", "B11", "B12"]
    assert meta["nodata"] == -9999.0


# Test 5: SHA-256 generation (streaming, matches standard hashlib)
def test_sha256_streaming(synthetic_geotiff_dir):
    sample_file = os.path.join(synthetic_geotiff_dir, "PLOT360_AGR_01_2020.tif")
    sha1 = calculate_file_sha256(sample_file)
    assert len(sha1) == 64

    # Compare with standard read
    with open(sample_file, "rb") as f:
        sha2 = hashlib.sha256(f.read()).hexdigest()
    assert sha1 == sha2


# Test 6: 2020/2025 pairing logic
def test_temporal_pairing_logic(synthetic_geotiff_dir):
    manifest = scan_and_validate_sentinel_dataset(source_dir=synthetic_geotiff_dir, generate_manifest=False)
    inv = manifest["discovered_inventory"]
    assert inv["total_raster_files"] == 4
    assert inv["observations_2020"] == 2
    assert inv["observations_2025"] == 2
    assert inv["complete_pairs"] == 2
    assert inv["missing_t1"] == 0
    assert inv["missing_t2"] == 0


# Test 7: Missing T1 simulation
def test_missing_t1_simulation(tmp_path):
    d = tmp_path / "missing_t1_test"
    d.mkdir()
    # Create only 2025 observation
    transform = from_origin(500000.0, 3400000.0, 10.0, 10.0)
    with rasterio.open(
        d / "PLOT360_AGR_01_2025.tif",
        "w",
        driver="GTiff",
        height=10,
        width=10,
        count=6,
        dtype="float32",
        crs="EPSG:32643",
        transform=transform
    ) as dst:
        dst.write(np.ones((6, 10, 10), dtype=np.float32))

    manifest = scan_and_validate_sentinel_dataset(source_dir=str(d), generate_manifest=False)
    assert manifest["discovered_inventory"]["missing_t1"] == 1
    assert manifest["discovered_inventory"]["complete_pairs"] == 0


# Test 8: Missing T2 simulation
def test_missing_t2_simulation(tmp_path):
    d = tmp_path / "missing_t2_test"
    d.mkdir()
    # Create only 2020 observation
    transform = from_origin(500000.0, 3400000.0, 10.0, 10.0)
    with rasterio.open(
        d / "PLOT360_AGR_01_2020.tif",
        "w",
        driver="GTiff",
        height=10,
        width=10,
        count=6,
        dtype="float32",
        crs="EPSG:32643",
        transform=transform
    ) as dst:
        dst.write(np.ones((6, 10, 10), dtype=np.float32))

    manifest = scan_and_validate_sentinel_dataset(source_dir=str(d), generate_manifest=False)
    assert manifest["discovered_inventory"]["missing_t2"] == 1
    assert manifest["discovered_inventory"]["complete_pairs"] == 0


# Test 9: Duplicate candidate simulation
def test_duplicate_candidate_simulation(tmp_path):
    d = tmp_path / "dup_test"
    d.mkdir()
    transform = from_origin(500000.0, 3400000.0, 10.0, 10.0)
    # Two files for 2020 in same region
    for fname in ["PLOT360_AGR_01_2020.tif", "PLOT360_AGR_01_2020_copy.tif", "PLOT360_AGR_01_2025.tif"]:
        with rasterio.open(
            d / fname,
            "w",
            driver="GTiff",
            height=10,
            width=10,
            count=6,
            dtype="float32",
            crs="EPSG:32643",
            transform=transform
        ) as dst:
            dst.write(np.ones((6, 10, 10), dtype=np.float32))

    manifest = scan_and_validate_sentinel_dataset(source_dir=str(d), generate_manifest=False)
    assert manifest["discovered_inventory"]["duplicate_ambiguous_pairs"] >= 1


# Test 10: Ambiguous filename simulation
def test_ambiguous_filename_simulation():
    parsed = parse_raster_filename("unparseable_satellite_export.tif")
    assert parsed["classification"] == "UNRESOLVED"
    assert parsed["region_id"] is None
    assert parsed["year"] is None


# Test 11: Test-file classification
def test_test_file_classification():
    parsed = parse_raster_filename("PLOT360_TEST_2025.tif")
    assert parsed["classification"] == "TEST"
    assert parsed["year"] == 2025


# Test 12: Mask detection (absence vs presence)
def test_mask_detection_audit(synthetic_geotiff_dir):
    # Without mask
    manifest1 = scan_and_validate_sentinel_dataset(source_dir=synthetic_geotiff_dir, generate_manifest=False)
    assert manifest1["discovered_inventory"]["has_supervised_masks"] is False
    assert manifest1["discovered_inventory"]["supervised_training_status"] == "LABEL_BLOCKED"

    # With masks added
    transform = from_origin(500000.0, 3400000.0, 10.0, 10.0)
    for reg in ["AGR_01", "URB_01"]:
        with rasterio.open(
            os.path.join(synthetic_geotiff_dir, f"PLOT360_{reg}_mask.tif"),
            "w",
            driver="GTiff",
            height=20,
            width=20,
            count=1,
            dtype="uint8",
            crs="EPSG:32643",
            transform=transform
        ) as dst:
            dst.write(np.zeros((1, 20, 20), dtype=np.uint8))

    manifest2 = scan_and_validate_sentinel_dataset(source_dir=synthetic_geotiff_dir, generate_manifest=False)
    assert manifest2["discovered_inventory"]["has_supervised_masks"] is True
    assert manifest2["discovered_inventory"]["supervised_training_status"] == "AVAILABLE"


from app.database import SessionLocal


@pytest.fixture
def db_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Test 13: Supervised training blocked when no valid masks exist
def test_supervised_training_blocked(client, admin_token):
    res = client.post(
        "/api/v1/ai/train",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={"dataset_id": "DS-SENTINEL2-INDIA-V1"}
    )
    assert res.status_code == 400
    body = res.json()
    err_detail = body.get("message") or body.get("detail")
    assert err_detail["error_code"] == "SUPERVISED_TRAINING_LABELS_UNAVAILABLE"
    assert "LABEL_BLOCKED" in err_detail["status"]


# Test 14: Manifest generation
def test_manifest_generation(tmp_path):
    out_manifest = tmp_path / "test_manifest.json"
    manifest = scan_and_validate_sentinel_dataset(
        generate_manifest=True,
        output_manifest_path=str(out_manifest)
    )
    assert os.path.exists(str(out_manifest))
    with open(out_manifest, "r", encoding="utf-8") as f:
        loaded = json.load(f)
    assert loaded["dataset_version"] == DATASET_VERSION
    assert loaded["status"] == "VALIDATED"


# Test 15: Dataset fingerprint consistency (deterministic output)
def test_dataset_fingerprint_deterministic():
    m1 = scan_and_validate_sentinel_dataset(generate_manifest=False)
    m2 = scan_and_validate_sentinel_dataset(generate_manifest=False)
    assert m1["dataset_fingerprint"] == m2["dataset_fingerprint"]
    assert len(m1["dataset_fingerprint"]) == 64


# Test 16: Idempotent DB registration
def test_idempotent_db_registration(db_session: Session):
    manifest = scan_and_validate_sentinel_dataset(generate_manifest=False)
    res1 = register_dataset_in_db(manifest, db_session)
    count_obs_1 = db_session.query(SatelliteObservation).count()
    count_pairs_1 = db_session.query(TemporalPair).count()

    res2 = register_dataset_in_db(manifest, db_session)
    count_obs_2 = db_session.query(SatelliteObservation).count()
    count_pairs_2 = db_session.query(TemporalPair).count()

    assert count_obs_1 == count_obs_2
    assert count_pairs_1 == count_pairs_2
    assert res1["status"] == "SUCCESS"
    assert res2["status"] == "SUCCESS"


# Test 17: Source immutability: file list and hashes unchanged after scanning
def test_source_folder_immutability():
    sentinel_dir = settings.sentinel_dir
    candidates = [
        os.path.join(settings.DATA_DIR, "baseline_hashes.json"),
        os.path.join(str(settings.project_root), "backend", "data", "baseline_hashes.json"),
        os.path.join(os.path.dirname(__file__), "..", "data", "baseline_hashes.json")
    ]
    baseline_path = next((c for c in candidates if os.path.exists(c)), None)
    if not baseline_path:
        pytest.skip("Baseline hashes not found")

    with open(baseline_path, "r", encoding="utf-8") as f:
        baseline = json.load(f)

    # Re-verify all current files and hashes in the source folder
    current_files = sorted([f for f in os.listdir(sentinel_dir) if f.endswith(".tif")])
    assert len(current_files) == len(baseline), "File count must not change!"

    for fname in current_files:
        fp = os.path.join(sentinel_dir, fname)
        curr_size = os.path.getsize(fp)
        curr_sha = calculate_file_sha256(fp)
        base_entry = baseline[fname]

        assert curr_size == base_entry["size"], f"File size changed for {fname}!"
        assert curr_sha == base_entry["sha256"], f"SHA-256 hash changed for {fname}!"


# Test 18: AI dataset API
def test_api_datasets_list_and_detail(client, citizen_token):
    # List datasets
    res = client.get("/api/v1/ai/datasets", headers={"Authorization": f"Bearer {citizen_token}"})
    assert res.status_code == 200
    datasets = res.json()
    assert len(datasets) > 0
    ds_id = datasets[0]["dataset_id"]

    # Detail
    res_detail = client.get(f"/api/v1/ai/datasets/{ds_id}", headers={"Authorization": f"Bearer {citizen_token}"})
    assert res_detail.status_code == 200
    detail = res_detail.json()
    assert detail["dataset_version"] == "sentinel2-temporal-v1"
    assert detail["status"] == "VALIDATED"


# Test 19: Temporal pairs API
def test_api_dataset_pairs(client, citizen_token):
    res = client.get("/api/v1/ai/datasets/DS-SENTINEL2-INDIA-V1/pairs", headers={"Authorization": f"Bearer {citizen_token}"})
    assert res.status_code == 200
    pairs = res.json()
    assert len(pairs) == 23
    p = pairs[0]
    assert "t1_year" in p and p["t1_year"] == 2020
    assert "t2_year" in p and p["t2_year"] == 2025
    assert "region_id" in p


# Test 20: Observation metadata API
def test_api_observations(client, citizen_token):
    res = client.get("/api/v1/ai/datasets/DS-SENTINEL2-INDIA-V1/observations", headers={"Authorization": f"Bearer {citizen_token}"})
    assert res.status_code == 200
    obs_list = res.json()
    assert len(obs_list) == 46

    # Test single observation
    single_res = client.get(f"/api/v1/ai/observations/{obs_list[0]['observation_id']}", headers={"Authorization": f"Bearer {citizen_token}"})
    assert single_res.status_code == 200
    single = single_res.json()
    assert single["band_count"] == 6
    assert single["source_relative_path"] is not None
    assert single["checksum_sha256"] is not None


# Test 21: Health API dataset_health
def test_health_dataset_endpoints(client):
    # Detailed health check
    res = client.get("/api/v1/health/detailed")
    assert res.status_code == 200
    data = res.json()
    assert "dataset_health" in data
    dh = data["dataset_health"]
    assert dh["source_folder_available"] is True
    assert dh["total_source_files"] == 46
    assert dh["valid_imagery"] == 46
    assert dh["complete_pairs"] == 23
    assert dh["has_supervised_masks"] is False
    assert dh["supervised_training_status"] == "LABEL_BLOCKED"

    # Standalone dataset health endpoint
    res2 = client.get("/api/v1/health/dataset")
    assert res2.status_code == 200
    assert res2.json()["complete_pairs"] == 23


# Test 22: Spatial linkage from raster bounds to cadastral geometry & View Evidence
def test_spatial_linkage_and_evidence(client, citizen_token):
    res = client.get("/api/v1/ai/change-events/P-1027/evidence", headers={"Authorization": f"Bearer {citizen_token}"})
    assert res.status_code == 200
    ev = res.json()
    assert ev["parcel_id"] == "P-1027"
    assert ev["ulpin"] == "IN-PB-CHD-0001027"
    assert ev["t1_date"] == "2020"
    assert ev["t2_date"] == "2025"
    assert "Sentinel-2" in ev["t1_source"]
    assert "t1_file" in ev and ev["t1_file"] is not None
    assert "t2_file" in ev and ev["t2_file"] is not None
    assert ev["dataset_version"] == "sentinel2-temporal-v1"
    assert ev["evidence_provenance"] is not None
    assert "POTENTIAL CHANGE DETECTED — VERIFICATION REQUIRED" in ev["ai_explanation"]
