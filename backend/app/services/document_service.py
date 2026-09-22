"""
PLOT360 — Document Intelligence Service
Tesseract OCR + regex-based field extraction.
Clearly marks all extractions as DEMO_OCR_EXTRACTION.
"""
import re
import os
import logging
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)


# Regex patterns for Indian land document field extraction
_ULPIN_RE = re.compile(r'IN-[A-Z]{2}-[A-Z]{3}-\d{7}', re.IGNORECASE)
_PARCEL_RE = re.compile(r'P-?\d{4}', re.IGNORECASE)
_AREA_M2_RE = re.compile(r'(\d[\d,\.]+)\s*(?:sq\.?\s*m|m²|sqm)', re.IGNORECASE)
_AREA_ACRE_RE = re.compile(r'(\d[\d,\.]+)\s*(?:acre|kanals?|marlas?)', re.IGNORECASE)
_REG_ID_RE = re.compile(r'REG-[A-Z]{2}-\d{4}-\d+', re.IGNORECASE)
_DATE_RE = re.compile(r'\d{1,2}[\s\-/]\w+[\s\-/]\d{4}|\d{4}-\d{2}-\d{2}')


def extract_document_data(file_path: str, mime_type: str = "") -> Dict[str, Any]:
    """
    Extracts structured fields from a document file using Tesseract OCR.
    Falls back to regex-only if Tesseract is unavailable.
    """
    text = _extract_text(file_path, mime_type)
    if not text:
        return {
            "success": False,
            "extracted": None,
            "mismatches": [],
            "confidence": 0.0,
            "note": "DEMO_OCR_EXTRACTION — Could not extract text from document.",
        }

    extracted = _extract_fields(text)
    # Confidence: ratio of found fields to expected fields
    expected_fields = ["ulpin", "parcel_id", "area", "registration_id"]
    found = sum(1 for f in expected_fields if extracted.get(f))
    confidence = round(found / len(expected_fields), 2)

    return {
        "success": True,
        "extracted": extracted,
        "mismatches": [],  # Compare to DB records in production
        "confidence": confidence,
        "char_count": len(text),
        "note": "DEMO_OCR_EXTRACTION — Results are illustrative only. Not authoritative.",
    }


def _extract_text(file_path: str, mime_type: str) -> Optional[str]:
    """Extract raw text using Tesseract OCR or PDF text extraction."""
    # Try Tesseract for images
    if mime_type.startswith("image/") or file_path.lower().endswith((".jpg", ".jpeg", ".png", ".tif", ".tiff")):
        return _tesseract_ocr(file_path)

    # Try PyMuPDF/pdfplumber for PDFs
    if mime_type == "application/pdf" or file_path.lower().endswith(".pdf"):
        text = _pdf_text(file_path)
        if text:
            return text
        # Fallback: OCR the PDF pages as images
        return _tesseract_ocr(file_path)

    # Plain text
    try:
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            return f.read()
    except Exception:
        return None


def _tesseract_ocr(file_path: str) -> Optional[str]:
    try:
        import pytesseract
        from PIL import Image
        from app.config import settings

        if settings.TESSERACT_CMD:
            pytesseract.pytesseract.tesseract_cmd = settings.TESSERACT_CMD

        img = Image.open(file_path)
        text = pytesseract.image_to_string(img, lang="eng+hin")
        return text
    except Exception as e:
        logger.warning(f"Tesseract OCR failed: {e}")
        return None


def _pdf_text(file_path: str) -> Optional[str]:
    try:
        import pdfplumber
        pages = []
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                pages.append(page.extract_text() or "")
        return "\n".join(pages)
    except ImportError:
        pass
    except Exception as e:
        logger.warning(f"PDF text extraction failed: {e}")
    return None


def _extract_fields(text: str) -> Dict[str, Any]:
    """Apply regex patterns to extract structured fields."""
    ulpin_match = _ULPIN_RE.search(text)
    parcel_match = _PARCEL_RE.search(text)
    area_m2_match = _AREA_M2_RE.search(text)
    area_acre_match = _AREA_ACRE_RE.search(text)
    reg_id_match = _REG_ID_RE.search(text)
    dates = _DATE_RE.findall(text)

    return {
        "ulpin": ulpin_match.group(0).upper() if ulpin_match else None,
        "parcel_id": parcel_match.group(0).upper() if parcel_match else None,
        "area": area_m2_match.group(0) if area_m2_match else (area_acre_match.group(0) if area_acre_match else None),
        "registration_id": reg_id_match.group(0).upper() if reg_id_match else None,
        "dates_found": dates[:3] if dates else [],
        "text_length": len(text),
    }
