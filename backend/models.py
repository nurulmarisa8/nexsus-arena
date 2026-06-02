from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from database import Base

class RoleEnum(str, enum.Enum):
    admin = "admin"
    player = "player"

class TournamentStatus(str, enum.Enum):
    upcoming = "upcoming"
    open = "open"
    ongoing = "ongoing"
    finished = "finished"

class MatchStatus(str, enum.Enum):
    pending = "pending"
    live = "live"
    finished = "finished"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String) # Catatan: Untuk produksi, ini harus di-hash
    role = Column(String, default=RoleEnum.player.value)
    
    team_members = relationship("TeamMember", back_populates="user")

class Game(Base):
    __tablename__ = "games"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    genre = Column(String)
    image_url = Column(String, nullable=True)

    tournaments = relationship("Tournament", back_populates="game")

class Tournament(Base):
    __tablename__ = "tournaments"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    game_id = Column(Integer, ForeignKey("games.id"))
    status = Column(String, default=TournamentStatus.upcoming.value)
    prize_pool = Column(String)
    start_date = Column(DateTime, default=datetime.utcnow)

    game = relationship("Game", back_populates="tournaments")
    matches = relationship("Match", back_populates="tournament")

class Team(Base):
    __tablename__ = "teams"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    logo_url = Column(String, nullable=True)
    captain_id = Column(Integer, ForeignKey("users.id"))
    
    members = relationship("TeamMember", back_populates="team")

class TeamMember(Base):
    __tablename__ = "team_members"
    
    id = Column(Integer, primary_key=True, index=True)
    team_id = Column(Integer, ForeignKey("teams.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    join_date = Column(DateTime, default=datetime.utcnow)

    team = relationship("Team", back_populates="members")
    user = relationship("User", back_populates="team_members")

class Match(Base):
    __tablename__ = "matches"
    
    id = Column(Integer, primary_key=True, index=True)
    tournament_id = Column(Integer, ForeignKey("tournaments.id"))
    team1_id = Column(Integer, ForeignKey("teams.id"))
    team2_id = Column(Integer, ForeignKey("teams.id"))
    score_team1 = Column(Integer, default=0)
    score_team2 = Column(Integer, default=0)
    status = Column(String, default=MatchStatus.pending.value)
    match_date = Column(DateTime, default=datetime.utcnow)

    tournament = relationship("Tournament", back_populates="matches")
    team1 = relationship("Team", foreign_keys=[team1_id])
    team2 = relationship("Team", foreign_keys=[team2_id])
