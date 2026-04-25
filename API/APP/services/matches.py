import logging
from typing import Optional

from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload

from app.models.group import Group
from app.models.groupLog import ActionTypeEnum, GroupLog
from app.models.groupMember import GroupMember
from app.models.match import Match
from app.models.matchPlayer import MatchPlayer
from app.models.ruleset import Ruleset
from app.schemas.match import MatchCreate

logger = logging.getLogger(__name__)


def _load_ruleset_or_raise(db: Session, ruleset_id: int) -> Ruleset:
    ruleset = db.query(Ruleset).filter(Ruleset.id == ruleset_id).first()
    if not ruleset:
        raise ValueError(f"Ruleset {ruleset_id} not found")
    return ruleset


def _ensure_group_exists(db: Session, group_id: int) -> Group:
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise ValueError(f"Group {group_id} not found")
    return group


def _validate_participants_are_group_members(
    db: Session, group_id: int, player_ids: list[int]
) -> None:
    member_ids = {
        row[0]
        for row in db.query(GroupMember.user_id)
        .filter(
            GroupMember.group_id == group_id,
            GroupMember.user_id.in_(player_ids),
            GroupMember.active == True,
            GroupMember.banned == False,
        )
        .all()
    }
    missing = [pid for pid in player_ids if pid not in member_ids]
    if missing:
        raise ValueError(
            f"Users {missing} are not active members of group {group_id}"
        )


def _validate_points_against_ruleset(match_data: MatchCreate, ruleset: Ruleset) -> None:
    if len(match_data.players) > ruleset.max_players:
        raise ValueError(
            f"Match has {len(match_data.players)} players but ruleset allows up to {ruleset.max_players}"
        )

    for player in match_data.players:
        if player.points_earned < 0:
            raise ValueError(f"Player {player.player_id} has negative points")
        if player.points_earned > ruleset.victory_points:
            raise ValueError(
                f"Player {player.player_id} has {player.points_earned} points "
                f"but ruleset max is {ruleset.victory_points}"
            )

    winner = next(p for p in match_data.players if p.player_id == match_data.winner_id)
    if winner.points_earned < ruleset.victory_points:
        raise ValueError(
            f"Winner must have at least {ruleset.victory_points} points to end the match"
        )


def create_match(db: Session, group_id: int, match_data: MatchCreate) -> Match:
    try:
        _ensure_group_exists(db, group_id)
        ruleset = _load_ruleset_or_raise(db, match_data.ruleset_id)

        player_ids = [p.player_id for p in match_data.players]
        _validate_participants_are_group_members(db, group_id, player_ids)
        _validate_points_against_ruleset(match_data, ruleset)

        match = Match(
            date=match_data.date,
            group_id=group_id,
            ruleset_id=match_data.ruleset_id,
            winner_id=match_data.winner_id,
            duration_mins=match_data.duration_mins,
            has_player_extension=match_data.has_player_extension,
            notes=match_data.notes,
        )
        db.add(match)
        db.flush()

        for p in match_data.players:
            db.add(
                MatchPlayer(
                    match_id=match.id,
                    player_id=p.player_id,
                    points_earned=p.points_earned,
                    longest_road=p.longest_road,
                    largest_army=p.largest_army,
                    thief_moves=p.thief_moves,
                    city_count=p.city_count,
                    village_count=p.village_count,
                    roads_built=p.roads_built,
                )
            )

        db.add(
            GroupLog(
                group_id=group_id,
                user_id=match_data.winner_id,
                action_type=ActionTypeEnum.CREATED_MATCH,
                extra_data={"match_id": match.id, "winner_id": match_data.winner_id},
            )
        )

        db.commit()
        db.refresh(match)
        logger.info(f"Match {match.id} created in group {group_id}")
        return match
    except ValueError:
        db.rollback()
        raise
    except Exception as e:
        logger.error(f"Unexpected error creating match in group {group_id}: {e}")
        db.rollback()
        raise


def list_group_matches(
    db: Session,
    group_id: int,
    limit: int = 20,
    offset: int = 0,
    ruleset_id: Optional[int] = None,
) -> tuple[list[Match], int]:
    base = db.query(Match).filter(Match.group_id == group_id)
    if ruleset_id is not None:
        base = base.filter(Match.ruleset_id == ruleset_id)

    total = base.with_entities(func.count(Match.id)).scalar() or 0
    items = (
        base.options(joinedload(Match.winner), joinedload(Match.ruleset))
        .order_by(Match.date.desc(), Match.id.desc())
        .limit(limit)
        .offset(offset)
        .all()
    )
    return items, total


def get_match_detail(db: Session, match_id: int) -> Optional[Match]:
    return (
        db.query(Match)
        .options(
            joinedload(Match.winner),
            joinedload(Match.ruleset),
            joinedload(Match.match_players).joinedload(MatchPlayer.player),
            joinedload(Match.events),
        )
        .filter(Match.id == match_id)
        .first()
    )


def delete_match(db: Session, match_id: int) -> bool:
    try:
        match = db.query(Match).filter(Match.id == match_id).first()
        if not match:
            return False
        db.delete(match)
        db.commit()
        logger.info(f"Match {match_id} deleted")
        return True
    except Exception as e:
        logger.error(f"Error deleting match {match_id}: {e}")
        db.rollback()
        raise
