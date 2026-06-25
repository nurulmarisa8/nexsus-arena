from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from database import Base


# ── ENUM DEFINITIONS ──────────────────────────────────────────────────────────

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


# ── TABEL: users ───────────────────────────────────────────────────────────────
# Menyimpan semua akun pengguna (admin & player)
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True)              # Username unik
    email = Column(String(255), unique=True, index=True)
    password = Column(String(255))                       # Disimpan dalam bentuk hash (bcrypt)
    role = Column(String(255), default=RoleEnum.player.value)  # 'admin' atau 'player'
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=True)  # Tim aktif user saat ini
    status = Column(String(255), default="verified")
    region = Column(String(255), default="NA East")

    team_members = relationship("TeamMember", back_populates="user")
    team = relationship("Team", foreign_keys=[team_id])


# ── TABEL: games ───────────────────────────────────────────────────────────────
# Daftar game yang tersedia di platform (Valorant, MLBB, dll)
class Game(Base):
    __tablename__ = "games"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True)
    genre = Column(String(255))
    image_url = Column(String(255), nullable=True)

    tournaments = relationship("Tournament", back_populates="game")


# ── TABEL: tournaments ─────────────────────────────────────────────────────────
# Turnamen yang dibuat oleh admin — terhubung ke game
class Tournament(Base):
    __tablename__ = "tournaments"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True)
    game_id = Column(Integer, ForeignKey("games.id"))
    status = Column(String(255), default=TournamentStatus.upcoming.value)  # upcoming/open/ongoing/finished
    prize_pool = Column(String(255))
    max_teams = Column(Integer, default=16)              # Batas maksimal tim peserta
    description = Column(String(255), nullable=True)
    format = Column(String(255), nullable=True)          # Contoh: Single Elimination, Round Robin
    region = Column(String(255), nullable=True)
    start_date = Column(DateTime, default=datetime.utcnow)

    game = relationship("Game", back_populates="tournaments")
    matches = relationship("Match", back_populates="tournament")
    registrations = relationship("TournamentRegistration", back_populates="tournament")


# ── TABEL: teams ───────────────────────────────────────────────────────────────
# Tim e-sports yang dibuat oleh player
class Team(Base):
    __tablename__ = "teams"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True)
    logo_url = Column(String(255), nullable=True)
    captain_id = Column(Integer, ForeignKey("users.id", use_alter=True, name="fk_team_captain_id"))  # Ketua tim
    status = Column(String(255), default="verified")
    region = Column(String(255), default="NA East")
    created_at = Column(DateTime, default=datetime.utcnow)

    members = relationship("TeamMember", back_populates="team")
    registrations = relationship("TournamentRegistration", back_populates="team")


# ── TABEL: team_members ────────────────────────────────────────────────────────
# Relasi many-to-many antara user dan tim (roster anggota)
class TeamMember(Base):
    __tablename__ = "team_members"

    id = Column(Integer, primary_key=True, index=True)
    team_id = Column(Integer, ForeignKey("teams.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    role = Column(String(255), default="member")        # 'captain' atau 'member'
    status = Column(String(255), default="active")
    join_date = Column(DateTime, default=datetime.utcnow)

    team = relationship("Team", back_populates="members")
    user = relationship("User", back_populates="team_members")


# ── TABEL: matches ─────────────────────────────────────────────────────────────
# Pertandingan antara 2 tim dalam suatu turnamen
class Match(Base):
    __tablename__ = "matches"

    id = Column(Integer, primary_key=True, index=True)
    tournament_id = Column(Integer, ForeignKey("tournaments.id"))
    team1_id = Column(Integer, ForeignKey("teams.id"))
    team2_id = Column(Integer, ForeignKey("teams.id"))
    score_team1 = Column(Integer, default=0)
    score_team2 = Column(Integer, default=0)
    status = Column(String(255), default=MatchStatus.pending.value)  # pending/live/in_progress/finished
    match_date = Column(DateTime, default=datetime.utcnow)
    winner_id = Column(Integer, ForeignKey("teams.id"), nullable=True)  # Diisi setelah match selesai
    round_name = Column(String(255), nullable=True)     # Contoh: "Semi Finals", "Finals"

    tournament = relationship("Tournament", back_populates="matches")
    team1 = relationship("Team", foreign_keys=[team1_id])
    team2 = relationship("Team", foreign_keys=[team2_id])
    winner = relationship("Team", foreign_keys=[winner_id])


# ── TABEL: tournament_registrations ───────────────────────────────────────────
# Mencatat tim mana saja yang sudah daftar ke turnamen tertentu
class TournamentRegistration(Base):
    __tablename__ = "tournament_registrations"

    id = Column(Integer, primary_key=True, index=True)
    tournament_id = Column(Integer, ForeignKey("tournaments.id"))
    team_id = Column(Integer, ForeignKey("teams.id"))
    registered_at = Column(DateTime, default=datetime.utcnow)

    tournament = relationship("Tournament", back_populates="registrations")
    team = relationship("Team", back_populates="registrations")


# ── TABEL: server_schedules ────────────────────────────────────────────────────
# Jadwal server pertandingan per region (dikelola admin)
class ServerSchedule(Base):
    __tablename__ = "server_schedules"

    id = Column(Integer, primary_key=True, index=True)
    time = Column(String(255))                           # Jam mulai, contoh: "18:00 UTC"
    region = Column(String(255))                         # Contoh: "NA East", "EU West"
    title = Column(String(255))
    server = Column(String(255))                         # Alamat server, contoh: "us-east-1.nexusarena.gg"
    active = Column(Boolean, default=False)              # True = server sedang aktif
    tournament_id = Column(Integer, ForeignKey("tournaments.id"), nullable=True)
