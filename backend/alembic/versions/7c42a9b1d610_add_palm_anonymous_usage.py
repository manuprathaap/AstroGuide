"""add anonymous palm analysis usage tracking

Revision ID: 7c42a9b1d610
Revises: 33e93273dcd4
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "7c42a9b1d610"
down_revision: Union[str, Sequence[str], None] = "33e93273dcd4"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "palm_anonymous_usage",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("token_hash", sa.String(length=64), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("token_hash"),
    )
    op.create_index(
        "ix_palm_anonymous_usage_token_hash",
        "palm_anonymous_usage",
        ["token_hash"],
        unique=True,
    )


def downgrade() -> None:
    op.drop_index(
        "ix_palm_anonymous_usage_token_hash",
        table_name="palm_anonymous_usage",
    )
    op.drop_table("palm_anonymous_usage")
