import logging
from typing import Optional

import pandas as pd
from sqlalchemy.orm import Session, joinedload

from app.models.match import Match
from app.models.matchPlayer import MatchPlayer
from app.schemas.stats import (
    GroupStatsOut,
    MonthCount,
    NemesisEntry,
    PartnerEntry,
    PlayerProfileStats,
    PlayerStatsInGroup,
)

logger = logging.getLogger(__name__)


def _empty_group_stats(group_id: int) -> GroupStatsOut:
    return GroupStatsOut(
        group_id=group_id,
        total_matches=0,
        avg_duration_mins=None,
        matches_per_month=[],
        players=[],
        longest_road_winrate_pct=None,
        largest_army_winrate_pct=None,
        both_bonuses_winrate_pct=None,
    )


def _empty_player_profile(group_id: int, user_id: int) -> PlayerProfileStats:
    return PlayerProfileStats(
        user_id=user_id,
        group_id=group_id,
        matches_played=0,
        matches_won=0,
        win_rate=0.0,
        avg_points=0.0,
        current_streak=0,
        best_partner=None,
        nemesis=None,
    )


def _matches_to_rows(matches: list[Match]) -> list[dict]:
    rows = []
    for m in matches:
        for mp in m.match_players:
            rows.append(
                {
                    "match_id": m.id,
                    "match_date": m.date,
                    "duration_mins": m.duration_mins,
                    "ruleset_id": m.ruleset_id,
                    "winner_id": m.winner_id,
                    "player_id": mp.player_id,
                    "username": mp.player.username if mp.player else None,
                    "display_name": mp.player.display_name if mp.player else None,
                    "won": m.winner_id == mp.player_id,
                    "points": mp.points_earned,
                    "longest_road": bool(mp.longest_road),
                    "largest_army": bool(mp.largest_army),
                }
            )
    return rows


def get_group_stats(
    db: Session, group_id: int, ruleset_id: Optional[int] = None
) -> GroupStatsOut:
    try:
        query = (
            db.query(Match)
            .options(joinedload(Match.match_players).joinedload(MatchPlayer.player))
            .filter(Match.group_id == group_id)
        )
        if ruleset_id is not None:
            query = query.filter(Match.ruleset_id == ruleset_id)

        matches = query.all()
        if not matches:
            return _empty_group_stats(group_id)

        df = pd.DataFrame(_matches_to_rows(matches))

        per_player = (
            df.groupby(["player_id", "username", "display_name"], dropna=False)
            .agg(
                matches_played=("match_id", "nunique"),
                wins=("won", "sum"),
                avg_points=("points", "mean"),
            )
            .reset_index()
        )
        per_player["win_rate"] = (
            (per_player["wins"] / per_player["matches_played"]).fillna(0).round(4)
        )
        per_player["avg_points"] = per_player["avg_points"].round(2)

        players = [
            PlayerStatsInGroup(
                user_id=int(row["player_id"]),
                username=row["username"] if pd.notna(row["username"]) else None,
                display_name=row["display_name"] if pd.notna(row["display_name"]) else None,
                matches_played=int(row["matches_played"]),
                wins=int(row["wins"]),
                win_rate=float(row["win_rate"]),
                avg_points=float(row["avg_points"]),
            )
            for _, row in per_player.iterrows()
        ]
        players.sort(key=lambda p: (-p.wins, -p.win_rate))

        matches_df = df.drop_duplicates("match_id").copy()
        total_matches = len(matches_df)

        durations = matches_df["duration_mins"].dropna()
        avg_duration = float(round(durations.mean(), 2)) if not durations.empty else None

        matches_df["month"] = pd.to_datetime(matches_df["match_date"]).dt.strftime("%Y-%m")
        monthly = matches_df.groupby("month").size().reset_index(name="count").sort_values("month")
        matches_per_month = [
            MonthCount(month=row["month"], count=int(row["count"]))
            for _, row in monthly.iterrows()
        ]

        winners_df = df[df["won"]]
        if total_matches > 0:
            longest_road_pct = round(int(winners_df["longest_road"].sum()) / total_matches * 100, 2)
            largest_army_pct = round(int(winners_df["largest_army"].sum()) / total_matches * 100, 2)
            both_pct = round(
                int((winners_df["longest_road"] & winners_df["largest_army"]).sum())
                / total_matches
                * 100,
                2,
            )
        else:
            longest_road_pct = largest_army_pct = both_pct = None

        return GroupStatsOut(
            group_id=group_id,
            total_matches=total_matches,
            avg_duration_mins=avg_duration,
            matches_per_month=matches_per_month,
            players=players,
            longest_road_winrate_pct=longest_road_pct,
            largest_army_winrate_pct=largest_army_pct,
            both_bonuses_winrate_pct=both_pct,
        )
    except Exception as e:
        logger.error(f"Error calculating stats for group {group_id}: {e}")
        raise



def get_player_current_streak(db: Session, player_id: int) -> int:
    results = (
        db.query(Match.winner_id)
        .join(MatchPlayer, MatchPlayer.match_id == Match.id)
        .filter(MatchPlayer.player_id == player_id)
        .order_by(Match.date.desc())
        .all()
    )

    streak = 0
    for (winner_id,) in results:
        if winner_id == player_id:
            streak += 1
        else:
            break

    return streak

def get_player_profile_stats(db: Session,user_id: int) -> PlayerProfileStats:
    try:
        player_matches_player = (
            db.query(MatchPlayer)
            .join(MatchPlayer.match)
            .options(joinedload(MatchPlayer.match))
            .filter(MatchPlayer.player_id == user_id)
            .order_by(Match.date.desc(), Match.id.desc())
            .all()
        )

        all_my_points = [mp.points_earned for mp in player_matches_player]
        matches_played = len(player_matches_player)
        matches_won = sum(1 for mp in player_matches_player if mp.match.winner_id == user_id)
        win_rate = round(matches_won / matches_played, 4) if matches_played else 0.0
        avg_points = round(sum(all_my_points) / len(all_my_points), 2) if all_my_points else 0.0
        streak = get_player_current_streak(db, user_id)
    except Exception as e:
        logger.error(
            f"Error calculating player profile for user {user_id} {e}"
        )
        raise

def get_player_profile_in_group(
    db: Session, group_id: int, user_id: int
) -> PlayerProfileStats:
    try:
        matches = (
            db.query(Match)
            .options(joinedload(Match.match_players).joinedload(MatchPlayer.player))
            .filter(Match.group_id == group_id)
            .order_by(Match.date.desc(), Match.id.desc())
            .all()
        )

        my_matches = [
            m for m in matches if any(mp.player_id == user_id for mp in m.match_players)
        ]
        if not my_matches:
            return _empty_player_profile(group_id, user_id)

        my_points: list[int] = []
        for m in my_matches:
            for mp in m.match_players:
                if mp.player_id == user_id:
                    my_points.append(mp.points_earned)
                    break

        matches_played = len(my_matches)
        matches_won = sum(1 for m in my_matches if m.winner_id == user_id)
        win_rate = round(matches_won / matches_played, 4) if matches_played else 0.0
        avg_points = round(sum(my_points) / len(my_points), 2) if my_points else 0.0

        current_streak = 0
        for m in my_matches:
            if m.winner_id == user_id:
                current_streak += 1
            else:
                break

        partners: dict[int, dict] = {}
        for m in my_matches:
            for mp in m.match_players:
                if mp.player_id == user_id:
                    continue
                entry = partners.setdefault(
                    mp.player_id,
                    {
                        "together": 0,
                        "my_wins": 0,
                        "their_wins": 0,
                        "display_name": (
                            (mp.player.display_name if mp.player else None)
                            or (mp.player.username if mp.player else None)
                        ),
                    },
                )
                entry["together"] += 1
                if m.winner_id == user_id:
                    entry["my_wins"] += 1
                elif m.winner_id == mp.player_id:
                    entry["their_wins"] += 1

        best_partner = None
        if partners:
            bp_id, bp = max(
                partners.items(),
                key=lambda x: (
                    x[1]["my_wins"] / x[1]["together"] if x[1]["together"] else 0,
                    x[1]["my_wins"],
                ),
            )
            if bp["my_wins"] > 0:
                best_partner = PartnerEntry(
                    user_id=bp_id,
                    display_name=bp["display_name"],
                    matches_together=bp["together"],
                    own_wins_when_together=bp["my_wins"],
                )

        nemesis = None
        if partners:
            n_id, n = max(
                partners.items(),
                key=lambda x: (x[1]["their_wins"], x[1]["together"]),
            )
            if n["their_wins"] > 0:
                nemesis = NemesisEntry(
                    user_id=n_id,
                    display_name=n["display_name"],
                    matches_together=n["together"],
                    losses_to_them=n["their_wins"],
                )

        return PlayerProfileStats(
            user_id=user_id,
            group_id=group_id,
            matches_played=matches_played,
            matches_won=matches_won,
            win_rate=win_rate,
            avg_points=avg_points,
            current_streak=current_streak,
            best_partner=best_partner,
            nemesis=nemesis,
        )
    except Exception as e:
        logger.error(
            f"Error calculating player profile for user {user_id} in group {group_id}: {e}"
        )
        raise
