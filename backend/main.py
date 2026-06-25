import io
import csv
from datetime import timedelta
from typing import List, Optional

from fastapi import FastAPI, Depends, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import or_, func

from database import engine, get_db
import models
import schemas
from auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
    require_admin,
    ACCESS_TOKEN_EXPIRE_MINUTES,
)

# Auto-create all database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Nexus Arena API",
    description="API for Nexus Arena E-Sports Tournament Management",
    version="1.0.0",
)

# Configure CORS so the React frontend can communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["System"])
def read_root():
    return {"message": "Welcome to Nexus Arena API", "status": "online"}


# ======================================================================
#  AUTH ENDPOINTS
# ======================================================================


@app.post("/api/auth/register", response_model=schemas.LoginResponse, tags=["Auth"])
def register(payload: schemas.RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(
        or_(models.User.email == payload.email, models.User.name == payload.username)
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email or username already registered",
        )

    hashed = hash_password(payload.password)
    user = models.User(
        name=payload.username,
        email=payload.email,
        password=hashed,
        role="player",
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )

    user_resp = schemas.UserResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        role=user.role,
        status=user.status,
        region=user.region,
        team_id=user.team_id,
        team_name=None,
    )
    return schemas.LoginResponse(access_token=token, token_type="bearer", user=user_resp)


@app.post("/api/auth/login", response_model=schemas.LoginResponse, tags=["Auth"])
def login(payload: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(
        or_(models.User.email == payload.email, models.User.name == payload.email)
    ).first()
    if not user or not verify_password(payload.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )

    team_name = None
    if user.team_id:
        team = db.query(models.Team).filter(models.Team.id == user.team_id).first()
        if team:
            team_name = team.name

    user_resp = schemas.UserResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        role=user.role,
        status=user.status,
        region=user.region,
        team_id=user.team_id,
        team_name=team_name,
    )
    return schemas.LoginResponse(access_token=token, token_type="bearer", user=user_resp)


@app.get("/api/auth/me", response_model=schemas.UserResponse, tags=["Auth"])
def get_me(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    team_name = None
    if current_user.team_id:
        team = db.query(models.Team).filter(models.Team.id == current_user.team_id).first()
        if team:
            team_name = team.name

    return schemas.UserResponse(
        id=current_user.id,
        name=current_user.name,
        email=current_user.email,
        role=current_user.role,
        status=current_user.status,
        region=current_user.region,
        team_id=current_user.team_id,
        team_name=team_name,
    )


# ======================================================================
#  GAMES ENDPOINTS
# ======================================================================


@app.get("/api/games", response_model=List[schemas.Game], tags=["Games"])
def get_games(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    games = db.query(models.Game).offset(skip).limit(limit).all()
    return games


@app.post("/api/games", response_model=schemas.Game, tags=["Games"])
def create_game(
    game: schemas.GameCreate,
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin),
):
    db_game = models.Game(**game.model_dump())
    db.add(db_game)
    db.commit()
    db.refresh(db_game)
    return db_game


# ======================================================================
#  TEAMS ENDPOINTS
# ======================================================================


def _build_team_response(team: models.Team, db: Session) -> schemas.TeamResponse:
    members_out: List[schemas.TeamMemberResponse] = []
    for m in team.members:
        user = db.query(models.User).filter(models.User.id == m.user_id).first()
        members_out.append(
            schemas.TeamMemberResponse(
                id=m.id,
                user_id=m.user_id,
                username=user.name if user else "Unknown",
                role=m.role,
                status=m.status,
                join_date=m.join_date,
            )
        )

    wins = (
        db.query(models.Match)
        .filter(models.Match.winner_id == team.id, models.Match.status == "finished")
        .count()
    )

    return schemas.TeamResponse(
        id=team.id,
        name=team.name,
        logo_url=team.logo_url,
        captain_id=team.captain_id,
        status=team.status,
        region=team.region,
        created_at=team.created_at,
        members=members_out,
        wins=wins,
    )


@app.get("/api/teams", response_model=List[schemas.TeamResponse], tags=["Teams"])
def get_teams(db: Session = Depends(get_db)):
    teams = db.query(models.Team).all()
    return [_build_team_response(t, db) for t in teams]


@app.post("/api/teams", response_model=schemas.TeamResponse, tags=["Teams"])
def create_team(
    payload: schemas.TeamCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    existing = db.query(models.Team).filter(models.Team.name == payload.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Team name already taken")

    team = models.Team(
        name=payload.name,
        logo_url=payload.logo_url,
        captain_id=current_user.id,
    )
    db.add(team)
    db.commit()
    db.refresh(team)

    # Add creator as captain member
    member = models.TeamMember(
        team_id=team.id,
        user_id=current_user.id,
        role="captain",
    )
    db.add(member)

    # Update user's team_id
    current_user.team_id = team.id
    db.commit()
    db.refresh(team)

    return _build_team_response(team, db)


@app.get("/api/teams/{team_id}", response_model=schemas.TeamResponse, tags=["Teams"])
def get_team(team_id: int, db: Session = Depends(get_db)):
    team = db.query(models.Team).filter(models.Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    return _build_team_response(team, db)


@app.post("/api/teams/{team_id}/members", response_model=schemas.TeamMemberResponse, tags=["Teams"])
def add_team_member(
    team_id: int,
    username: str = Query(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    team = db.query(models.Team).filter(models.Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")

    if current_user.role != "admin" and current_user.id != team.captain_id:
        raise HTTPException(status_code=403, detail="Only admin or team captain can add members")

    user = db.query(models.User).filter(models.User.name == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    existing = (
        db.query(models.TeamMember)
        .filter(models.TeamMember.team_id == team_id, models.TeamMember.user_id == user.id)
        .first()
    )
    if existing:
        raise HTTPException(status_code=400, detail="User is already a member of this team")

    member = models.TeamMember(team_id=team_id, user_id=user.id, role="member")
    db.add(member)
    user.team_id = team_id
    db.commit()
    db.refresh(member)

    return schemas.TeamMemberResponse(
        id=member.id,
        user_id=member.user_id,
        username=user.name,
        role=member.role,
        status=member.status,
        join_date=member.join_date,
    )


@app.delete("/api/teams/{team_id}/members/{user_id}", tags=["Teams"])
def remove_team_member(
    team_id: int,
    user_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    team = db.query(models.Team).filter(models.Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")

    if current_user.role != "admin" and current_user.id != team.captain_id:
        raise HTTPException(status_code=403, detail="Only admin or team captain can remove members")

    member = (
        db.query(models.TeamMember)
        .filter(models.TeamMember.team_id == team_id, models.TeamMember.user_id == user_id)
        .first()
    )
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")

    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user:
        user.team_id = None

    db.delete(member)
    db.commit()
    return {"detail": "Member removed"}


@app.post("/api/teams/{team_id}/leave", tags=["Teams"])
def leave_team(
    team_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    member = (
        db.query(models.TeamMember)
        .filter(
            models.TeamMember.team_id == team_id,
            models.TeamMember.user_id == current_user.id,
        )
        .first()
    )
    if not member:
        raise HTTPException(status_code=404, detail="You are not a member of this team")

    current_user.team_id = None
    db.delete(member)
    db.commit()
    return {"detail": "You have left the team"}


@app.patch("/api/teams/{team_id}/status", response_model=schemas.TeamResponse, tags=["Teams"])
def update_team_status(
    team_id: int,
    payload: schemas.UserUpdate,
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin),
):
    team = db.query(models.Team).filter(models.Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")

    if payload.status is not None:
        team.status = payload.status
    db.commit()
    db.refresh(team)
    return _build_team_response(team, db)


# ======================================================================
#  TOURNAMENTS ENDPOINTS
# ======================================================================


def _build_tournament_response(t: models.Tournament, db: Session) -> schemas.TournamentResponse:
    reg_count = (
        db.query(models.TournamentRegistration)
        .filter(models.TournamentRegistration.tournament_id == t.id)
        .count()
    )
    game = None
    if t.game:
        game = schemas.Game(id=t.game.id, name=t.game.name, genre=t.game.genre, image_url=t.game.image_url)

    return schemas.TournamentResponse(
        id=t.id,
        title=t.title,
        game_id=t.game_id,
        status=t.status,
        prize_pool=t.prize_pool,
        max_teams=t.max_teams,
        description=t.description,
        format=t.format,
        region=t.region,
        start_date=t.start_date,
        game=game,
        registered_teams=reg_count,
    )


@app.get("/api/tournaments", response_model=List[schemas.TournamentResponse], tags=["Tournaments"])
def get_tournaments(db: Session = Depends(get_db)):
    tournaments = db.query(models.Tournament).order_by(models.Tournament.id.desc()).all()
    return [_build_tournament_response(t, db) for t in tournaments]


@app.post("/api/tournaments", response_model=schemas.TournamentResponse, tags=["Tournaments"])
def create_tournament(
    payload: schemas.TournamentCreate,
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin),
):
    tournament = models.Tournament(**payload.model_dump())
    db.add(tournament)
    db.commit()
    db.refresh(tournament)
    return _build_tournament_response(tournament, db)


@app.patch("/api/tournaments/{tournament_id}", response_model=schemas.TournamentResponse, tags=["Tournaments"])
def update_tournament(
    tournament_id: int,
    payload: schemas.TournamentUpdate,
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin),
):
    tournament = db.query(models.Tournament).filter(models.Tournament.id == tournament_id).first()
    if not tournament:
        raise HTTPException(status_code=404, detail="Tournament not found")

    update_data = payload.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(tournament, key, value)

    db.commit()
    db.refresh(tournament)
    return _build_tournament_response(tournament, db)


@app.post("/api/tournaments/{tournament_id}/register", tags=["Tournaments"])
def register_for_tournament(
    tournament_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    tournament = db.query(models.Tournament).filter(models.Tournament.id == tournament_id).first()
    if not tournament:
        raise HTTPException(status_code=404, detail="Tournament not found")

    if not current_user.team_id:
        raise HTTPException(status_code=400, detail="You must be in a team to register")

    # Check if user is captain
    team = db.query(models.Team).filter(models.Team.id == current_user.team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")

    existing = (
        db.query(models.TournamentRegistration)
        .filter(
            models.TournamentRegistration.tournament_id == tournament_id,
            models.TournamentRegistration.team_id == team.id,
        )
        .first()
    )
    if existing:
        raise HTTPException(status_code=400, detail="Team already registered for this tournament")

    reg_count = (
        db.query(models.TournamentRegistration)
        .filter(models.TournamentRegistration.tournament_id == tournament_id)
        .count()
    )
    if reg_count >= tournament.max_teams:
        raise HTTPException(status_code=400, detail="Tournament is full")

    registration = models.TournamentRegistration(
        tournament_id=tournament_id,
        team_id=team.id,
    )
    db.add(registration)
    db.commit()
    return {"detail": "Team registered successfully"}


@app.get("/api/tournaments/{tournament_id}/brackets", response_model=schemas.BracketResponse, tags=["Tournaments"])
def get_tournament_brackets(tournament_id: int, db: Session = Depends(get_db)):
    tournament = db.query(models.Tournament).filter(models.Tournament.id == tournament_id).first()
    if not tournament:
        raise HTTPException(status_code=404, detail="Tournament not found")

    matches = (
        db.query(models.Match)
        .filter(models.Match.tournament_id == tournament_id)
        .order_by(models.Match.match_date)
        .all()
    )

    if not matches:
        return schemas.BracketResponse(name=tournament.title, rounds=[])

    # Group matches into rounds based on round_name
    # Define standard sorting order for rounds
    round_order = {
        "Round 1": 1,
        "Quarter Finals": 2,
        "Semi Finals": 3,
        "Finals": 4
    }

    rounds_dict: dict[str, list] = {}
    for match in matches:
        r_name = match.round_name or "Unassigned"
        if r_name not in rounds_dict:
            rounds_dict[r_name] = []

        team1_name = match.team1.name if match.team1 else "TBD"
        team2_name = match.team2.name if match.team2 else "TBD"

        winner_val = None
        if match.winner_id:
            if match.winner_id == match.team1_id:
                winner_val = 1
            elif match.winner_id == match.team2_id:
                winner_val = 2

        rounds_dict[r_name].append(
            schemas.BracketMatch(
                team1=team1_name,
                team2=team2_name,
                score1=match.score_team1,
                score2=match.score_team2,
                winner=winner_val,
            )
        )

    # Sort rounds explicitly
    def get_round_sort_key(name):
        return round_order.get(name, 99)

    rounds_out = []
    for r_name in sorted(rounds_dict.keys(), key=get_round_sort_key):
        rounds_out.append(schemas.BracketRound(name=r_name, matches=rounds_dict[r_name]))

    return schemas.BracketResponse(name=tournament.title, rounds=rounds_out)


# ======================================================================
#  MATCHES ENDPOINTS
# ======================================================================


def _build_match_response(match: models.Match) -> schemas.MatchResponse:
    return schemas.MatchResponse(
        id=match.id,
        tournament_id=match.tournament_id,
        tournament_name=match.tournament.title if match.tournament else "Unknown",
        team1_id=match.team1_id,
        team2_id=match.team2_id,
        team1_name=match.team1.name if match.team1 else "TBD",
        team2_name=match.team2.name if match.team2 else "TBD",
        score_team1=match.score_team1,
        score_team2=match.score_team2,
        status=match.status,
        match_date=match.match_date,
        winner_name=match.winner.name if match.winner else None,
        round_name=match.round_name,
    )





@app.get("/api/matches", response_model=List[schemas.MatchResponse], tags=["Matches"])
def get_matches(
    status: Optional[str] = None,
    tournament_id: Optional[int] = None,
    db: Session = Depends(get_db),
):
    query = db.query(models.Match)
    if status:
        query = query.filter(models.Match.status == status)
    if tournament_id:
        query = query.filter(models.Match.tournament_id == tournament_id)
    matches = query.all()
    return [_build_match_response(m) for m in matches]


@app.post("/api/matches", response_model=schemas.MatchResponse, tags=["Matches"])
def create_match(
    payload: schemas.MatchCreate,
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin),
):
    tournament = db.query(models.Tournament).filter(models.Tournament.id == payload.tournament_id).first()
    if not tournament:
        raise HTTPException(status_code=404, detail="Tournament not found")

    team1 = db.query(models.Team).filter(models.Team.id == payload.team1_id).first()
    team2 = db.query(models.Team).filter(models.Team.id == payload.team2_id).first()
    if not team1 or not team2:
        raise HTTPException(status_code=404, detail="One or both teams not found")

    match = models.Match(
        tournament_id=payload.tournament_id,
        team1_id=payload.team1_id,
        team2_id=payload.team2_id,
        match_date=payload.match_date,
        round_name=payload.round_name,
    )
    db.add(match)
    db.commit()
    db.refresh(match)
    return _build_match_response(match)


@app.patch("/api/matches/{match_id}/score", response_model=schemas.MatchResponse, tags=["Matches"])
def update_match_score(
    match_id: int,
    payload: schemas.MatchScoreUpdate,
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin),
):
    match = db.query(models.Match).filter(models.Match.id == match_id).first()
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")

    match.score_team1 = payload.score_team1
    match.score_team2 = payload.score_team2
    match.status = "finished"

    if payload.score_team1 > payload.score_team2:
        match.winner_id = match.team1_id
    elif payload.score_team2 > payload.score_team1:
        match.winner_id = match.team2_id
    else:
        match.winner_id = None

    db.commit()
    db.refresh(match)
    return _build_match_response(match)


# ======================================================================
#  USERS ENDPOINTS (Admin)
# ======================================================================


@app.get("/api/users/export", tags=["Users"])
def export_users_csv(
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin),
):
    users = db.query(models.User).all()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["id", "name", "email", "role", "status", "region", "team_id"])
    for u in users:
        writer.writerow([u.id, u.name, u.email, u.role, u.status, u.region, u.team_id])

    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=users_export.csv"},
    )


@app.get("/api/users", response_model=List[schemas.UserResponse], tags=["Users"])
def get_users(
    status: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin),
):
    query = db.query(models.User)
    if status:
        query = query.filter(models.User.status == status)
    if search:
        query = query.filter(
            or_(
                models.User.name.ilike(f"%{search}%"),
                models.User.email.ilike(f"%{search}%"),
            )
        )
    users = query.all()

    result = []
    for u in users:
        team_name = None
        if u.team_id:
            team = db.query(models.Team).filter(models.Team.id == u.team_id).first()
            if team:
                team_name = team.name
        result.append(
            schemas.UserResponse(
                id=u.id,
                name=u.name,
                email=u.email,
                role=u.role,
                status=u.status,
                region=u.region,
                team_id=u.team_id,
                team_name=team_name,
            )
        )
    return result


@app.patch("/api/users/{user_id}/status", response_model=schemas.UserResponse, tags=["Users"])
def update_user_status(
    user_id: int,
    payload: schemas.UserUpdate,
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin),
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if payload.status is not None:
        user.status = payload.status
    if payload.role is not None:
        user.role = payload.role

    db.commit()
    db.refresh(user)

    team_name = None
    if user.team_id:
        team = db.query(models.Team).filter(models.Team.id == user.team_id).first()
        if team:
            team_name = team.name

    return schemas.UserResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        role=user.role,
        status=user.status,
        region=user.region,
        team_id=user.team_id,
        team_name=team_name,
    )


# ======================================================================
#  SERVER SCHEDULE ENDPOINTS
# ======================================================================


@app.get("/api/servers", response_model=List[schemas.ServerScheduleResponse], tags=["Servers"])
def get_servers(db: Session = Depends(get_db)):
    return db.query(models.ServerSchedule).all()


@app.post("/api/servers", response_model=schemas.ServerScheduleResponse, tags=["Servers"])
def create_server(
    payload: schemas.ServerScheduleCreate,
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin),
):
    server = models.ServerSchedule(**payload.model_dump())
    db.add(server)
    db.commit()
    db.refresh(server)
    return server


@app.patch("/api/servers/{server_id}", response_model=schemas.ServerScheduleResponse, tags=["Servers"])
def update_server(
    server_id: int,
    payload: schemas.ServerScheduleUpdate,
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin),
):
    server = db.query(models.ServerSchedule).filter(models.ServerSchedule.id == server_id).first()
    if not server:
        raise HTTPException(status_code=404, detail="Server schedule not found")

    update_data = payload.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(server, key, value)

    db.commit()
    db.refresh(server)
    return server


@app.delete("/api/servers/{server_id}", tags=["Servers"])
def delete_server(
    server_id: int,
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin),
):
    server = db.query(models.ServerSchedule).filter(models.ServerSchedule.id == server_id).first()
    if not server:
        raise HTTPException(status_code=404, detail="Server schedule not found")
    db.delete(server)
    db.commit()
    return {"detail": "Server schedule deleted"}


# ======================================================================
@app.patch("/api/auth/me", response_model=schemas.UserResponse, tags=["Auth"])
def update_me(
    payload: schemas.UserUpdateProfile,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if payload.name:
        current_user.name = payload.name
    if payload.email:
        current_user.email = payload.email
    if payload.password:
        current_user.hashed_password = get_password_hash(payload.password)
    
    db.commit()
    db.refresh(current_user)

    team_name = None
    if current_user.team_id:
        team = db.query(models.Team).filter(models.Team.id == current_user.team_id).first()
        if team:
            team_name = team.name

    return schemas.UserResponse(
        id=current_user.id,
        name=current_user.name,
        email=current_user.email,
        role=current_user.role,
        status=current_user.status,
        region=current_user.region,
        team_id=current_user.team_id,
        team_name=team_name,
    )


# --- DASHBOARD & GENERAL ---


@app.get("/api/stats/admin", tags=["Stats"])
def admin_stats(
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin),
):
    total_games = db.query(models.Game).count()
    active_matches = (
        db.query(models.Match)
        .filter(or_(models.Match.status == "live", models.Match.status == "in_progress"))
        .count()
    )
    registered_teams = db.query(models.Team).count()
    active_users = db.query(models.User).filter(models.User.status == "verified").count()

    return {
        "total_games": total_games,
        "active_matches": active_matches,
        "registered_teams": registered_teams,
        "active_users": active_users,
    }


@app.get("/api/stats/player/{user_id}", tags=["Stats"])
def player_stats(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Find all teams the user is/was a member of
    team_ids = [
        tm.team_id
        for tm in db.query(models.TeamMember).filter(models.TeamMember.user_id == user_id).all()
    ]

    if not team_ids:
        return {
            "tournament_wins": 0,
            "matches_played": 0,
            "win_rate": 0.0,
            "rating": 1000,
        }

    matches_played = (
        db.query(models.Match)
        .filter(
            models.Match.status == "finished",
            or_(
                models.Match.team1_id.in_(team_ids),
                models.Match.team2_id.in_(team_ids),
            ),
        )
        .count()
    )

    matches_won = (
        db.query(models.Match)
        .filter(
            models.Match.status == "finished",
            models.Match.winner_id.in_(team_ids),
        )
        .count()
    )

    win_rate = (matches_won / matches_played * 100) if matches_played > 0 else 0.0

    # Simple rating calculation
    rating = 1000 + (matches_won * 50) - ((matches_played - matches_won) * 25)

    # Count tournament wins (tournaments where all matches are finished and the team won the last match)
    tournament_wins = 0
    tournaments_with_wins = (
        db.query(models.Match.tournament_id)
        .filter(
            models.Match.status == "finished",
            models.Match.winner_id.in_(team_ids),
        )
        .distinct()
        .all()
    )
    for (tid,) in tournaments_with_wins:
        last_match = (
            db.query(models.Match)
            .filter(models.Match.tournament_id == tid, models.Match.status == "finished")
            .order_by(models.Match.match_date.desc())
            .first()
        )
        if last_match and last_match.winner_id in team_ids:
            tournament_wins += 1

    return {
        "tournament_wins": tournament_wins,
        "matches_played": matches_played,
        "win_rate": round(win_rate, 1),
        "rating": max(rating, 0),
    }
