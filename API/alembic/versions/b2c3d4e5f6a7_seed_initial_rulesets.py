"""Seed initial rulesets (Base, Seafarers, Base 5-6, Seafarers 5-6)

Revision ID: b2c3d4e5f6a7
Revises: a1b2c3d4e5f6
Create Date: 2026-04-25 10:05:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


revision: str = "b2c3d4e5f6a7"
down_revision: Union[str, Sequence[str], None] = "a1b2c3d4e5f6"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


SEED_ROWS = [
    {
        "name": "base",
        "description": "Catán Base (10 puntos, hasta 4 jugadores)",
        "victory_points": 10,
        "max_players": 4,
    },
    {
        "name": "seafarers",
        "description": "Navegantes (13 puntos, hasta 4 jugadores)",
        "victory_points": 13,
        "max_players": 4,
    },
    {
        "name": "base",
        "description": "Catán Base 5-6 jugadores (10 puntos)",
        "victory_points": 10,
        "max_players": 6,
    },
    {
        "name": "seafarers",
        "description": "Navegantes 5-6 jugadores (13 puntos)",
        "victory_points": 13,
        "max_players": 6,
    },
]


def upgrade() -> None:
    ruleset_table = sa.table(
        "ruleset",
        sa.column("name", sa.String),
        sa.column("description", sa.String),
        sa.column("victory_points", sa.Integer),
        sa.column("max_players", sa.Integer),
    )
    op.bulk_insert(ruleset_table, SEED_ROWS)


def downgrade() -> None:
    descriptions = [row["description"] for row in SEED_ROWS]
    op.execute(
        sa.text("DELETE FROM ruleset WHERE description = ANY(:descriptions)").bindparams(
            sa.bindparam("descriptions", value=descriptions, expanding=True)
        )
    )
