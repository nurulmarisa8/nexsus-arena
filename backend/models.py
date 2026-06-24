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
    in_progress = "in_progress"
    finished = "finished"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    role = Column(String, default=RoleEnum.player.value)
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=True)
    status = Column(String, default="verified")
    region = Column(String, default="NA East")

    team_members = relationship("TeamMember", back_populates="user")
    team = relationship("Team", foreign_keys=[team_id])


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
    max_teams = Column(Integer, default=16)
    description = Column(String, nullable=True)
    format = Column(String, nullable=True)
    region = Column(String, nullable=True)
    start_date = Column(DateTime, default=datetime.utcnow)

    game = relationship("Game", back_populates="tournaments")
    matches = relationship("Match", back_populates="tournament")
    registrations = relationship("TournamentRegistration", back_populates="tournament")


class Team(Base):
    __tablename__ = "teams"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    logo_url = Column(String, nullable=True)
    captain_id = Column(Integer, ForeignKey("users.id"))
    status = Column(String, default="verified")
    region = Column(String, default="NA East")
    created_at = Column(DateTime, default=datetime.utcnow)

    members = relationship("TeamMember", back_populates="team")
    registrations = relationship("TournamentRegistration", back_populates="team")


class TeamMember(Base):
    __tablename__ = "team_members"

    id = Column(Integer, primary_key=True, index=True)
    team_id = Column(Integer, ForeignKey("teams.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    role = Column(String, default="member")
    status = Column(String, default="active")
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
    winner_id = Column(Integer, ForeignKey("teams.id"), nullable=True)
    round_name = Column(String, nullable=True)

    tournament = relationship("Tournament", back_populates="matches")
    team1 = relationship("Team", foreign_keys=[team1_id])
    team2 = relationship("Team", foreign_keys=[team2_id])
    winner = relationship("Team", foreign_keys=[winner_id])


class TournamentRegistration(Base):
    __tablename__ = "tournament_registrations"

    id = Column(Integer, primary_key=True, index=True)
    tournament_id = Column(Integer, ForeignKey("tournaments.id"))
    team_id = Column(Integer, ForeignKey("teams.id"))
    registered_at = Column(DateTime, default=datetime.utcnow)

    tournament = relationship("Tournament", back_populates="registrations")
    team = relationship("Team", back_populates="registrations")


class ServerSchedule(Base):
    __tablename__ = "server_schedules"

    id = Column(Integer, primary_key=True, index=True)
    time = Column(String)
    region = Column(String)
    title = Column(String)
    server = Column(String)
    active = Column(Boolean, default=False)
    tournament_id = Column(Integer, ForeignKey("tournaments.id"), nullable=True)
