"""
PLOT360 Backend — Storage Abstraction Layer
Local filesystem storage with cloud-ready interface (GCS/S3 compatible).
"""
import os
import shutil
import uuid
from abc import ABC, abstractmethod
from typing import Optional, BinaryIO
from app.config import settings


class BaseStorage(ABC):
    """Abstract storage interface for documents, GeoTIFFs, and model weights."""

    @abstractmethod
    def save(self, file_obj: BinaryIO, category: str, filename: str) -> str:
        """Save a file and return its storage URI."""
        pass

    @abstractmethod
    def get_path(self, storage_uri: str) -> str:
        """Get local filesystem path from storage URI."""
        pass

    @abstractmethod
    def exists(self, storage_uri: str) -> bool:
        """Check if file exists."""
        pass

    @abstractmethod
    def delete(self, storage_uri: str) -> bool:
        """Delete file from storage."""
        pass


class LocalStorage(BaseStorage):
    """Local filesystem storage implementation."""

    def __init__(self, base_dir: Optional[str] = None):
        self.base_dir = base_dir or settings.DATA_DIR
        self._ensure_dirs()

    def _ensure_dirs(self):
        for sub in ["documents", "imagery/raw", "imagery/processed", "imagery/predictions", "masks", "models"]:
            os.makedirs(os.path.join(self.base_dir, sub), exist_ok=True)

    def save(self, file_obj: BinaryIO, category: str, filename: str) -> str:
        safe_category = category.strip("/\\")
        target_dir = os.path.join(self.base_dir, safe_category)
        os.makedirs(target_dir, exist_ok=True)

        # Generate unique storage filename
        unique_name = f"{uuid.uuid4().hex[:10]}_{filename}"
        full_path = os.path.join(target_dir, unique_name)

        with open(full_path, "wb") as buffer:
            shutil.copyfileobj(file_obj, buffer)

        # Return standardized URI
        rel_path = os.path.relpath(full_path, self.base_dir).replace("\\", "/")
        return f"storage://{rel_path}"

    def get_path(self, storage_uri: str) -> str:
        if storage_uri.startswith("storage://"):
            rel_path = storage_uri[len("storage://"):]
            return os.path.normpath(os.path.join(self.base_dir, rel_path))
        return storage_uri

    def exists(self, storage_uri: str) -> bool:
        path = self.get_path(storage_uri)
        return os.path.exists(path)

    def delete(self, storage_uri: str) -> bool:
        path = self.get_path(storage_uri)
        if os.path.exists(path):
            try:
                os.remove(path)
                return True
            except OSError:
                return False
        return False


# Singleton storage instance
storage = LocalStorage()
