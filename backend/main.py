from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from database import engine, get_db
import models, schemas

# Auto-create all database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Nexus Arena API",
    description="API for Nexus Arena E-Sports Tournament Management",
    version="0.1.0"
)

# Configure CORS so the React frontend can communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["System"])
def read_root():
    return {"message": "Welcome to Nexus Arena API", "status": "online"}

# --- GAMES ENDPOINTS ---
@app.get("/api/games", response_model=List[schemas.Game], tags=["Games"])
def get_games(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    games = db.query(models.Game).offset(skip).limit(limit).all()
    return games

@app.post("/api/games", response_model=schemas.Game, tags=["Games"])
def create_game(game: schemas.GameCreate, db: Session = Depends(get_db)):
    db_game = models.Game(**game.model_dump())
    db.add(db_game)
    db.commit()
    db.refresh(db_game)
    return db_game

# --- USERS ENDPOINTS ---
@app.get("/api/users", response_model=List[schemas.User], tags=["Users"])
def get_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = db.query(models.User).offset(skip).limit(limit).all()
    return users

@app.post("/api/users", response_model=schemas.User, tags=["Users"])
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Di aplikasi nyata, password harus di-hash
    db_user = models.User(name=user.name, email=user.email, password=user.password, role=user.role)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# --- TOURNAMENTS ENDPOINTS ---
@app.get("/api/tournaments", response_model=List[schemas.Tournament], tags=["Tournaments"])
def get_tournaments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    tournaments = db.query(models.Tournament).offset(skip).limit(limit).all()
    return tournaments

@app.post("/api/tournaments", response_model=schemas.Tournament, tags=["Tournaments"])
def create_tournament(tournament: schemas.TournamentCreate, db: Session = Depends(get_db)):
    db_tournament = models.Tournament(**tournament.model_dump())
    db.add(db_tournament)
    db.commit()
    db.refresh(db_tournament)
    return db_tournament
