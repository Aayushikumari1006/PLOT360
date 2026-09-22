"""001_initial_schema

Revision ID: 001_initial_schema
Revises: 
Create Date: 2026-09-22 00:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '001_initial_schema'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Tables are dynamically created through Base.metadata
    from app.database import Base, engine
    import app.models  # ensure models imported
    Base.metadata.create_all(bind=op.get_bind())


def downgrade() -> None:
    from app.database import Base
    import app.models
    Base.metadata.drop_all(bind=op.get_bind())
