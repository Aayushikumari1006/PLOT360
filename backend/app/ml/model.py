"""
PLOT360 Backend — Siamese Temporal U-Net Architecture
Sections 28 & 61: Siamese Temporal U-Net (PyTorch).
Shared weights encoder for T1 and T2 -> feature difference & concatenation -> convolutional decoder -> change mask.
"""
import torch
import torch.nn as nn
import torch.nn.functional as F
from typing import Tuple, Dict, Any


class ConvBlock(nn.Module):
    """Dual convolution block with BatchNorm and ReLU."""
    def __init__(self, in_channels: int, out_channels: int):
        super().__init__()
        self.conv = nn.Sequential(
            nn.Conv2d(in_channels, out_channels, kernel_size=3, padding=1, bias=False),
            nn.BatchNorm2d(out_channels),
            nn.ReLU(inplace=True),
            nn.Conv2d(out_channels, out_channels, kernel_size=3, padding=1, bias=False),
            nn.BatchNorm2d(out_channels),
            nn.ReLU(inplace=True),
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.conv(x)


class SiameseEncoder(nn.Module):
    """Shared encoder for extracting multi-scale features from an observation."""
    def __init__(self, in_channels: int = 3, base_channels: int = 32):
        super().__init__()
        self.enc1 = ConvBlock(in_channels, base_channels)
        self.pool1 = nn.MaxPool2d(2)
        self.enc2 = ConvBlock(base_channels, base_channels * 2)
        self.pool2 = nn.MaxPool2d(2)
        self.enc3 = ConvBlock(base_channels * 2, base_channels * 4)
        self.pool3 = nn.MaxPool2d(2)
        self.enc4 = ConvBlock(base_channels * 4, base_channels * 8)

    def forward(self, x: torch.Tensor) -> Tuple[torch.Tensor, torch.Tensor, torch.Tensor, torch.Tensor]:
        f1 = self.enc1(x)
        f2 = self.enc2(self.pool1(f1))
        f3 = self.enc3(self.pool2(f2))
        f4 = self.enc4(self.pool3(f3))
        return f1, f2, f3, f4


class SiameseTemporalUNet(nn.Module):
    """
    Siamese Temporal U-Net.
    Inputs:
      - x1: Observation at T1 (B, C, H, W)
      - x2: Observation at T2 (B, C, H, W)
    Outputs:
      - logits: Binary change mask logits (B, 1, H, W)
    """
    def __init__(self, in_channels_per_obs: int = 3, base_channels: int = 32):
        super().__init__()
        # Shared encoder
        self.encoder = SiameseEncoder(in_channels=in_channels_per_obs, base_channels=base_channels)

        # Bottleneck after temporal fusion (concatenation of f4_1, f4_2, and absolute difference)
        # f4 has base_channels * 8 channels. Concatenating f4_1, f4_2, |f4_1 - f4_2| -> base_channels * 24
        f4_ch = base_channels * 8
        self.fusion4 = ConvBlock(f4_ch * 3, f4_ch)

        # Decoder with skip connections
        self.up3 = nn.ConvTranspose2d(f4_ch, base_channels * 4, kernel_size=2, stride=2)
        # skip3 from fusion of f3_1, f3_2, diff3: base_channels*4 * 3 -> base_channels*4
        self.fusion3 = nn.Conv2d(base_channels * 4 * 3, base_channels * 4, kernel_size=1)
        self.dec3 = ConvBlock(base_channels * 8, base_channels * 4)

        self.up2 = nn.ConvTranspose2d(base_channels * 4, base_channels * 2, kernel_size=2, stride=2)
        self.fusion2 = nn.Conv2d(base_channels * 2 * 3, base_channels * 2, kernel_size=1)
        self.dec2 = ConvBlock(base_channels * 4, base_channels * 2)

        self.up1 = nn.ConvTranspose2d(base_channels * 2, base_channels, kernel_size=2, stride=2)
        self.fusion1 = nn.Conv2d(base_channels * 3, base_channels, kernel_size=1)
        self.dec1 = ConvBlock(base_channels * 2, base_channels)

        # Final 1x1 convolution for binary change mask
        self.final_conv = nn.Conv2d(base_channels, 1, kernel_size=1)

    def _fuse(self, f1: torch.Tensor, f2: torch.Tensor) -> torch.Tensor:
        diff = torch.abs(f1 - f2)
        return torch.cat([f1, f2, diff], dim=1)

    def forward(self, x1: torch.Tensor, x2: torch.Tensor) -> torch.Tensor:
        # Encode T1
        f1_1, f2_1, f3_1, f4_1 = self.encoder(x1)
        # Encode T2 (Shared weights)
        f1_2, f2_2, f3_2, f4_2 = self.encoder(x2)

        # Bottleneck temporal fusion
        fused4 = self._fuse(f4_1, f4_2)
        x = self.fusion4(fused4)

        # Decoder stage 3
        x = self.up3(x)
        skip3 = self.fusion3(self._fuse(f3_1, f3_2))
        x = torch.cat([x, skip3], dim=1)
        x = self.dec3(x)

        # Decoder stage 2
        x = self.up2(x)
        skip2 = self.fusion2(self._fuse(f2_1, f2_2))
        x = torch.cat([x, skip2], dim=1)
        x = self.dec2(x)

        # Decoder stage 1
        x = self.up1(x)
        skip1 = self.fusion1(self._fuse(f1_1, f1_2))
        x = torch.cat([x, skip1], dim=1)
        x = self.dec1(x)

        # Binary output logits
        logits = self.final_conv(x)
        return logits


class BCEDiceLoss(nn.Module):
    """
    Weighted BCE + Dice Loss for handling sparse change detection pixels.
    Section 63: Configurable weighting between BCE and Dice loss.
    """
    def __init__(self, bce_weight: float = 0.5, dice_weight: float = 0.5, smooth: float = 1e-6):
        super().__init__()
        self.bce_weight = bce_weight
        self.dice_weight = dice_weight
        self.smooth = smooth
        self.bce = nn.BCEWithLogitsLoss()

    def forward(self, logits: torch.Tensor, targets: torch.Tensor) -> torch.Tensor:
        bce_loss = self.bce(logits, targets)
        probs = torch.sigmoid(logits)

        # Flatten tensors for Dice calculation
        probs_flat = probs.view(-1)
        targets_flat = targets.view(-1)

        intersection = (probs_flat * targets_flat).sum()
        dice = (2.0 * intersection + self.smooth) / (probs_flat.sum() + targets_flat.sum() + self.smooth)
        dice_loss = 1.0 - dice

        return self.bce_weight * bce_loss + self.dice_weight * dice_loss


def calculate_metrics(predictions: torch.Tensor, targets: torch.Tensor, threshold: float = 0.5) -> Dict[str, float]:
    """Calculate Precision, Recall, F1, and IoU metrics (Section 64)."""
    preds = (predictions >= threshold).float().view(-1)
    targs = (targets >= threshold).float().view(-1)

    tp = (preds * targs).sum().item()
    fp = (preds * (1.0 - targs)).sum().item()
    fn = ((1.0 - preds) * targs).sum().item()
    tn = ((1.0 - preds) * (1.0 - targs)).sum().item()

    precision = tp / (tp + fp + 1e-7)
    recall = tp / (tp + fn + 1e-7)
    f1 = 2.0 * precision * recall / (precision + recall + 1e-7)
    iou = tp / (tp + fp + fn + 1e-7)

    return {
        "precision": round(precision, 4),
        "recall": round(recall, 4),
        "f1": round(f1, 4),
        "iou": round(iou, 4)
    }
