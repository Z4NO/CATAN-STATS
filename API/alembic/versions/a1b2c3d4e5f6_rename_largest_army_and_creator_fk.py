"""Schema cleanup: rename largest_army, add FK on groups.creator_id, add matches.notes, index matches.group_id

Revision ID: a1b2c3d4e5f6
Revises: ce055ae81cf9
Create Date: 2026-04-25 10:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


revision: str = "a1b2c3d4e5f6"
down_revision: Union[str, Sequence[str], None] = "ce055ae81cf9"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column(
        "match_players",
        "longest_army",
        new_column_name="largest_army",
    )
    op.create_foreign_key(
        "fk_groups_creator_id_users",
        "groups",
        "users",
        ["creator_id"],
        ["id"],
    )
    op.add_column(
        "matches",
        sa.Column("notes", sa.String(), nullable=True),
    )
    op.create_index("ix_matches_group_id", "matches", ["group_id"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_matches_group_id", table_name="matches")
    op.drop_column("matches", "notes")
    op.drop_constraint("fk_groups_creator_id_users", "groups", type_="foreignkey")
    op.alter_column(
        "match_players",
        "largest_army",
        new_column_name="longest_army",
    )
