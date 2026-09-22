# PLOT360 — AI Temporal Change Detection Pipeline
## Siamese Temporal U-Net Architecture & Operating Manual

### 1. Overview
The PLOT360 AI Change Detection Subsystem processes paired temporal Earth-observation satellite imagery (Sentinel-2 Harmonized Surface Reflectance) to identify candidate physical development footprints on cadastral land parcels.

---

### 2. Architecture: Siamese Temporal U-Net
The change detection model utilizes a **Siamese Temporal U-Net** implemented in PyTorch:
- **Shared Encoder**: Extracts multi-scale feature representations from $T_1$ (e.g. 2020) and $T_2$ (e.g. 2025) observations using weight-tied convolutional blocks.
- **Temporal Fusion**: Combines deep feature representations via feature difference $|F_1 - F_2|$ and feature concatenation $[F_1, F_2, |F_1 - F_2|]$.
- **Convolutional Decoder**: Progressively upsamples fused representations with cross-scale skip connections.
- **Output**: Binary change mask logits ($0 = \text{unchanged}, 1 = \text{changed}$).

---

### 3. Critical Supervised Training Rule (Section 26 & 55)
> [!IMPORTANT]
> **Supervised Training Requires Ground Truth Masks:**
> $T_1$ and $T_2$ observations alone are **NOT** ground truth for supervised training. Supervised training strictly requires:
> $T_1 + T_2 + \text{Ground Truth Mask}$
> If masks are missing, training is blocked with the notice:
> `"Masks unavailable for supervised training."`
> Unsupervised difference visualization and evidence demonstration remain available without masks.

---

### 4. Dataset Directory Layout
```text
data/
└── imagery/
    ├── raw/
    │   ├── location_001/
    │   │   ├── T1.tif              # Baseline observation (e.g. 2020)
    │   │   ├── T2.tif              # Target observation (e.g. 2025)
    │   │   ├── mask.tif            # Ground truth binary mask (0/1)
    │   │   └── metadata.json       # CRS, bands, dates, bounds
    │   └── location_002/
    └── processed/
        └── patches/                # Aligned 256x256 image patches
```

---

### 5. Geographic Location-Based Splitting
Random pixel-level splits across the same geographic scene lead to severe data leakage. PLOT360 strictly enforces **geographic location separation**:
- **Train Locations**: 15 sites
- **Validation Locations**: 4 sites
- **Test Locations**: 4 sites

---

### 6. Training Command & Hyperparameters
```bash
python backend/scripts/train_change_model.py \
  --dataset-id DS-SENTINEL2-INDIA-V1 \
  --epochs 20 \
  --batch-size 8 \
  --learning-rate 0.0001 \
  --patch-size 256 \
  --model-version Siamese-UNet-v2
```

#### Loss Function & Evaluation Metrics
- **Loss**: Weighted BCE + Dice loss ($0.5 \times \text{BCE} + 0.5 \times \text{Dice}$) to mitigate extreme class imbalance (sparse change pixels).
- **Evaluation Metrics**: Precision, Recall, F1 Score, and Intersection over Union (IoU).

---

### 7. Cadastral Cadastre Integration & Advisory Language
The AI pipeline detects spectral and textural spatial change. **It does NOT make legal decisions.**
- Output statement: `POTENTIAL CHANGE DETECTED — VERIFICATION REQUIRED`
- The system never outputs terms like `"illegal construction"` or `"unauthorized encroachment"`.
- Intersects candidate change polygons with PostGIS cadastral parcel boundaries to retrieve ULPIN, zoning, land use, and building permission sanctions for human field verification.

---

### 8. Known Limitations (Section 119)
- **Seasonal & Phenological Variations**: Agriculture cycles may produce spectral shifts that do not represent structural change.
- **Cloud & Shadow Artifacts**: Cloud masking depends on Sentinel-2 SCL bands; residual haze may cause false positives.
- **Spatial Resolution**: Sentinel-2 10m ground resolution can resolve building footprints (>100 m²) but cannot delineate fine sub-meter fences.
- **Domain Shift**: Models trained in arid Western zones may require calibration before applying to dense Western Ghats canopy zones.
