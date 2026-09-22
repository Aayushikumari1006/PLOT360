"""
PLOT360 Backend — Sentinel-2 Dataset Validation CLI Script
Sections 31–34:
Scans configured source directory, inspects GeoTIFF headers, validates 2020/2025 pairing,
audits ground-truth mask availability, generates manifest, and optionally registers in DB.
"""
import sys
import os
import argparse
import json

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.config import settings
from app.ml.dataset import scan_and_validate_sentinel_dataset, register_dataset_in_db
from app.database import SessionLocal, create_tables


def main():
    parser = argparse.ArgumentParser(description="Validate PLOT360 Sentinel-2 Temporal GeoTIFF Dataset")
    parser.add_argument("--data-dir", default=None, help="Path to Sentinel-2 dataset directory (default: configured SENTINEL_DATA_DIR)")
    parser.add_argument("--register-db", action="store_true", help="Idempotently register validated dataset in database")
    parser.add_argument("--json", action="store_true", help="Emit structured machine-readable JSON only")
    args = parser.parse_args()

    manifest = scan_and_validate_sentinel_dataset(source_dir=args.data_dir, generate_manifest=True)

    db_res = None
    if args.register_db:
        create_tables()
        db = SessionLocal()
        try:
            db_res = register_dataset_in_db(manifest, db)
        finally:
            db.close()

    if args.json:
        out = {
            "summary": manifest.get("status"),
            "dataset_version": manifest.get("dataset_version"),
            "dataset_fingerprint": manifest.get("dataset_fingerprint"),
            "inventory": manifest.get("discovered_inventory"),
            "expected_inventory": manifest.get("expected_inventory"),
            "crs_distribution": manifest.get("crs_distribution"),
            "resolution_distribution": manifest.get("resolution_distribution"),
            "band_summary": manifest.get("band_summary"),
            "observations": manifest.get("production_observations"),
            "test_observations": manifest.get("test_observations"),
            "pairs": manifest.get("temporal_pairs"),
            "masks": {
                "supervised_mask_count": manifest["discovered_inventory"].get("supervised_mask_count", 0),
                "has_supervised_masks": manifest["discovered_inventory"].get("has_supervised_masks", False),
                "supervised_training_status": manifest["discovered_inventory"].get("supervised_training_status", "LABEL_BLOCKED")
            },
            "fingerprint": manifest.get("dataset_fingerprint"),
            "manifest_path": manifest.get("manifest_path"),
            "db_registration": db_res,
            "warnings": manifest.get("warnings", []),
            "errors": manifest.get("errors", [])
        }
        print(json.dumps(out, indent=2))
        return

    # Formatted Terminal Summary
    inv = manifest.get("discovered_inventory", {})
    exp = manifest.get("expected_inventory", {})
    print("============================================================")
    print("SENTINEL-2 DATASET VALIDATION")
    print("------------------------------------------------------------")
    print(f"SOURCE DIRECTORY:           {manifest.get('source_root_resolved')}")
    print(f"DATASET VERSION:            {manifest.get('dataset_version')}")
    print(f"DATASET FINGERPRINT:        {manifest.get('dataset_fingerprint')}")
    print("")
    print(f"EXPECTED PRIMARY RASTERS:   {exp.get('primary_rasters', 46)}")
    print(f"DISCOVERED SOURCE FILES:    {inv.get('total_source_files', 0)}")
    print(f"DISCOVERED RASTER FILES:    {inv.get('total_raster_files', 0)}")
    print(f"VALID RASTERS:              {inv.get('valid_rasters', 0)}")
    print(f"INVALID RASTERS:            {inv.get('invalid_rasters', 0)}")
    print("")
    print(f"2020 OBSERVATIONS:          {inv.get('observations_2020', 0)}")
    print(f"2025 OBSERVATIONS:          {inv.get('observations_2025', 0)}")
    print("")
    print(f"EXPECTED TEMPORAL PAIRS:    {exp.get('temporal_pairs', 23)}")
    print(f"COMPLETE PAIRS:             {inv.get('complete_pairs', 0)}")
    print("")
    print(f"MISSING T1:                 {inv.get('missing_t1', 0)}")
    print(f"MISSING T2:                 {inv.get('missing_t2', 0)}")
    print("")
    print(f"DUPLICATE/AMBIGUOUS PAIRS:  {inv.get('duplicate_ambiguous_pairs', 0)}")
    print("")
    print(f"TEST/DEMO FILES:            {inv.get('test_observations', 0)}")
    print("")
    mask_txt = f"{inv.get('supervised_mask_count', 0)} found" if inv.get('has_supervised_masks') else "None present (0)"
    print(f"SUPERVISED MASKS:           {mask_txt}")
    print(f"SUPERVISED TRAINING:        {inv.get('supervised_training_status')}")
    print("")
    print("CRS DISTRIBUTION:")
    for crs, cnt in manifest.get("crs_distribution", {}).items():
        print(f"  - {crs}: {cnt} observations")
    print("")
    print("PIXEL SIZE / EXPORT GRID:")
    for res, cnt in manifest.get("resolution_distribution", {}).items():
        print(f"  - {res}: {cnt} observations")
    print("")
    print("BAND INVENTORY:")
    for bcnt, cnt in manifest.get("band_summary", {}).items():
        print(f"  - {bcnt} bands (B2, B3, B4, B8, B11, B12): {cnt} rasters")
    print("")
    if db_res:
        print(f"DB REGISTRATION:            {db_res.get('status')} ({db_res.get('observations_registered')} obs, {db_res.get('temporal_pairs_registered')} pairs)")
    print("")
    print("WARNINGS:")
    if manifest.get("warnings"):
        for w in manifest["warnings"]:
            print(f"  [!] {w}")
    else:
        print("  None")
    print("")
    print("ERRORS:")
    if manifest.get("errors"):
        for e in manifest["errors"]:
            print(f"  [X] {e}")
    else:
        print("  None")
    print("============================================================")


if __name__ == "__main__":
    main()

