from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


# --- AUTH SCHEMAS ---
class LoginRequest(BaseModel):
    email: str
    password: str


class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    status: str
    region: str
    team_id: Optional[int] = None
    team_name: Optional[str] = None

    class Config:
        from_attributes = True


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# --- USER SCHEMAS ---
class UserUpdate(BaseModel):
    status: Optional[str] = None
    role: Optional[str] = None


class UserUpdateProfile(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None


# --- GAME SCHEMAS ---
class GameBase(BaseModel):
    name: str
    genre: str
    image_url: Optional[str] = None


class GameCreate(GameBase):
    pass


class Game(GameBase):
    id: int

    class Config:
        from_attributes = True


# --- TEAM SCHEMAS ---
class TeamBase(BaseModel):
    name: str
    logo_url: Optional[str] = None
    region: Optional[str] = None


class TeamCreate(BaseModel):
    name: str
    logo_url: Optional[str] = None


class TeamMemberResponse(BaseModel):
    id: int
    user_id: int
    username: str
    role: str
    status: str
    join_date: Optional[datetime] = None

    class Config:
        from_attributes = True


class TeamResponse(BaseModel):
    id: int
    name: str
    logo_url: Optional[str] = None
    captain_id: int
    status: str
    region: str
    created_at: Optional[datetime] = None
    members: List[TeamMemberResponse] = []
    wins: int = 0

    class Config:
        from_attributes = True


# --- TOURNAMENT SCHEMAS ---
class TournamentBase(BaseModel):
    title: str
    game_id: int
    status: str = "upcoming"
    prize_pool: str
    max_teams: int = 16
    description: Optional[str] = None
    format: Optional[str] = None
    region: Optional[str] = None


class TournamentCreate(BaseModel):
    title: str
    game_id: int
    prize_pool: str
    max_teams: int = 16
    description: Optional[str] = None
    format: Optional[str] = None
    region: Optional[str] = None


class TournamentResponse(TournamentBase):
    id: int
    start_date: Optional[datetime] = None
    game: Optional[Game] = None
    registered_teams: int = 0

    class Config:
        from_attributes = True


class TournamentUpdate(BaseModel):
    status: Optional[str] = None
    title: Optional[str] = None
    prize_pool: Optional[str] = None


# --- MATCH SCHEMAS ---
class MatchResponse(BaseModel):
    id: int
    tournament_id: int
    tournament_name: str
    team1_id: int
    team2_id: int
    team1_name: str
    team2_name: str
    score_team1: int
    score_team2: int
    status: str
    match_date: Optional[datetime] = None
    winner_name: Optional[str] = None
    round_name: Optional[str] = None

    class Config:
        from_attributes = True


class MatchCreate(BaseModel):
    tournament_id: int
    team1_id: int
    team2_id: int
    match_date: Optional[datetime] = None
    round_name: Optional[str] = None


class MatchScoreUpdate(BaseModel):
    score_team1: int
    score_team2: int


# --- BRACKET SCHEMAS ---
class BracketMatch(BaseModel):
    team1: str
    team2: str
    score1: int
    score2: int
    winner: Optional[int] = None


class BracketRound(BaseModel):
    name: str
    matches: List[BracketMatch]


class BracketResponse(BaseModel):
    name: str
    rounds: List[BracketRound]


# --- SERVER SCHEDULE SCHEMAS ---
class ServerScheduleBase(BaseModel):
    time: str
    region: str
    title: str
    server: str
    active: bool = False


class ServerScheduleCreate(ServerScheduleBase):
    pass


class ServerScheduleResponse(ServerScheduleBase):
    id: int

    class Config:
        from_attributes = True


class ServerScheduleUpdate(BaseModel):
    time: Optional[str] = None
    region: Optional[str] = None
    title: Optional[str] = None
    server: Optional[str] = None
    active: Optional[bool] = None
