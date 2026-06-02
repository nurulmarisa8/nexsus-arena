from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

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

# --- USER SCHEMAS ---
class UserBase(BaseModel):
    name: str
    email: str
    role: str = "player"

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    class Config:
        from_attributes = True

# --- TOURNAMENT SCHEMAS ---
class TournamentBase(BaseModel):
    title: str
    game_id: int
    status: str = "upcoming"
    prize_pool: str

class TournamentCreate(TournamentBase):
    pass

class Tournament(TournamentBase):
    id: int
    start_date: datetime
    game: Optional[Game] = None
    class Config:
        from_attributes = True
