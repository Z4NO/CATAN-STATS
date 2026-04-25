from typing import Optional

from pydantic import BaseModel


class PlayerStatsInGroup(BaseModel):
    user_id: int
    username: Optional[str] = None
    display_name: Optional[str] = None
    matches_played: int
    wins: int
    win_rate: float
    avg_points: float


class MonthCount(BaseModel):
    month: str
    count: int


class GroupStatsOut(BaseModel):
    group_id: int
    total_matches: int
    avg_duration_mins: Optional[float] = None
    matches_per_month: list[MonthCount] = []
    players: list[PlayerStatsInGroup] = []
    longest_road_winrate_pct: Optional[float] = None
    largest_army_winrate_pct: Optional[float] = None
    both_bonuses_winrate_pct: Optional[float] = None


class PartnerEntry(BaseModel):
    user_id: int
    display_name: Optional[str] = None
    matches_together: int
    own_wins_when_together: int


class NemesisEntry(BaseModel):
    user_id: int
    display_name: Optional[str] = None
    matches_together: int
    losses_to_them: int


class PlayerProfileStats(BaseModel):
    user_id: int
    group_id: int
    matches_played: int
    matches_won: int
    win_rate: float
    avg_points: float
    current_streak: int
    best_partner: Optional[PartnerEntry] = None
    nemesis: Optional[NemesisEntry] = None


class PlayerGlobalProfileStats(BaseModel):
    user_id: int
    matches_played: int
    matches_won: int
    win_rate: float
    avg_points: float
    current_streak: int
    best_streak: int
    avg_thief_moves: float
    avg_cities: float
    avg_villages: float
    avg_roads_built: float
    longest_road_rate: float
    largest_army_rate: float
