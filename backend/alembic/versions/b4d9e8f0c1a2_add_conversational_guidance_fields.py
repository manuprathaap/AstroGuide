"""add conversational guidance fields

Revision ID: b4d9e8f0c1a2
Revises: 02017b803908
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "b4d9e8f0c1a2"
down_revision: Union[str, Sequence[str], None] = "02017b803908"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("guidance", sa.Column("category", sa.Text(), nullable=True))
    op.add_column("guidance", sa.Column("language", sa.Text(), nullable=True))
    op.add_column("guidance", sa.Column("message", sa.Text(), nullable=True))
    op.add_column("guidance", sa.Column("analysis", sa.JSON(), nullable=True))


def downgrade() -> None:
    op.drop_column("guidance", "analysis")
    op.drop_column("guidance", "message")
    op.drop_column("guidance", "language")
    op.drop_column("guidance", "category")