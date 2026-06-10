"""
Nexus Arena - Database Seed Script
Run with: python seed.py
"""

import sys
import os

# Ensure the backend directory is on the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from datetime import datetime, timedelta

from database import engine, SessionLocal, Base
import models
from auth import hash_password


def seed():
    # Step 1: Drop all tables and recreate
    print("Dropping all tables...")
    Base.metadata.drop_all(bind=engine)
    print("Creating all tables...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        # ==============================
        # Step 2: Create Games
        # ==============================
        print("Creating games...")
        game_valorant = models.Game(
            name="Valorant",
            genre="FPS",
            image_url="https://images.unsplash.com/photo-1626686007597-5c5607b4d88a?w=400",
        )
        game_apex = models.Game(
            name="Apex Legends",
            genre="Battle Royale",
            image_url="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400",
        )
        game_lol = models.Game(
            name="League of Legends",
            genre="MOBA",
            image_url="https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=400",
        )
        db.add_all([game_valorant, game_apex, game_lol])
        db.commit()
        db.refresh(game_valorant)
        db.refresh(game_apex)
        db.refresh(game_lol)
        print(f"  Created: {game_valorant.name}, {game_apex.name}, {game_lol.name}")

        # ==============================
        # Step 3: Create Admin User
        # ==============================
        print("Creating admin user...")
        admin_user = models.User(
            name="admin",
            email="admin@nexusarena.gg",
            password=hash_password("admin123"),
            role="admin",
            status="verified",
            region="NA East",
        )
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        print(f"  Admin: {admin_user.name} ({admin_user.email})")

        # ==============================
        # Step 4: Create Player Users
        # ==============================
        print("Creating players...")
        players_data = [
            {"name": "ShadowStep", "email": "player@nexusarena.gg", "password": "player123"},
            {"name": "RedViper", "email": "redviper@nexusarena.gg", "password": "player123"},
            {"name": "NightBlade", "email": "nightblade@nexusarena.gg", "password": "player123"},
            {"name": "QuantumX", "email": "quantumx@nexusarena.gg", "password": "player123"},
            {"name": "FrostByte", "email": "frostbyte@nexusarena.gg", "password": "player123"},
            {"name": "TitanBlock", "email": "titanblock@nexusarena.gg", "password": "player123"},
            {"name": "GlitchUser", "email": "glitchuser@nexusarena.gg", "password": "player123"},
            {"name": "SpecterAim", "email": "specteraim@nexusarena.gg", "password": "player123"},
            {"name": "BladeMaster", "email": "blademaster@nexusarena.gg", "password": "player123"},
        ]

        players = []
        for p in players_data:
            user = models.User(
                name=p["name"],
                email=p["email"],
                password=hash_password(p["password"]),
                role="player",
                status="verified",
                region="NA East",
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            players.append(user)
            print(f"  Player: {user.name} ({user.email})")

        # players[0] = ShadowStep, [1] = RedViper, [2] = NightBlade,
        # [3] = QuantumX, [4] = FrostByte, [5] = TitanBlock,
        # [6] = GlitchUser, [7] = SpecterAim, [8] = BladeMaster

        # ==============================
        # Step 5: Create Teams
        # ==============================
        print("Creating teams...")

        teams_data = [
            {
                "name": "Void Walkers",
                "captain": players[0],  # ShadowStep
                "members": [players[1]],  # RedViper
                "region": "NA East",
            },
            {
                "name": "Crimson Surge",
                "captain": players[2],  # NightBlade
                "members": [players[3]],  # QuantumX
                "region": "EU West",
            },
            {
                "name": "Aegis Protocol",
                "captain": players[4],  # FrostByte
                "members": [players[5]],  # TitanBlock
                "region": "NA East",
            },
            {
                "name": "Neon Syndicate",
                "captain": players[6],  # GlitchUser
                "members": [players[7]],  # SpecterAim
                "region": "Asia Pacific",
            },
            {
                "name": "Phantom X",
                "captain": players[8],  # BladeMaster
                "members": [],
                "region": "EU West",
            },
            {
                "name": "Iron Veil",
                "captain": players[1],  # RedViper (also in Void Walkers as member)
                "members": [],
                "region": "NA East",
            },
        ]

        teams = []
        for td in teams_data:
            team = models.Team(
                name=td["name"],
                captain_id=td["captain"].id,
                region=td["region"],
                status="verified",
            )
            db.add(team)
            db.commit()
            db.refresh(team)

            # Add captain as team member
            captain_member = models.TeamMember(
                team_id=team.id,
                user_id=td["captain"].id,
                role="captain",
                status="active",
            )
            db.add(captain_member)

            # Update captain's team_id
            td["captain"].team_id = team.id

            # Add other members
            for member_user in td["members"]:
                member = models.TeamMember(
                    team_id=team.id,
                    user_id=member_user.id,
                    role="member",
                    status="active",
                )
                db.add(member)
                member_user.team_id = team.id

            db.commit()
            teams.append(team)
            member_names = [m.name for m in td["members"]]
            print(f"  Team: {team.name} (Captain: {td['captain'].name}, Members: {member_names})")

        # teams[0] = Void Walkers, [1] = Crimson Surge, [2] = Aegis Protocol,
        # [3] = Neon Syndicate, [4] = Phantom X, [5] = Iron Veil

        # ==============================
        # Step 6: Create Tournaments
        # ==============================
        print("Creating tournaments...")

        now = datetime.utcnow()
        tournaments_data = [
            {
                "title": "Valorant Champions 2025",
                "game_id": game_valorant.id,
                "status": "ongoing",
                "prize_pool": "$50,000",
                "max_teams": 8,
                "description": "The premier Valorant championship tournament",
                "format": "Single Elimination",
                "region": "NA East",
                "start_date": now - timedelta(days=2),
            },
            {
                "title": "Apex Predator Cup",
                "game_id": game_apex.id,
                "status": "open",
                "prize_pool": "$25,000",
                "max_teams": 16,
                "description": "Battle royale at its finest",
                "format": "Double Elimination",
                "region": "EU West",
                "start_date": now + timedelta(days=7),
            },
            {
                "title": "League Masters Invitational",
                "game_id": game_lol.id,
                "status": "upcoming",
                "prize_pool": "$100,000",
                "max_teams": 8,
                "description": "The biggest League of Legends event of the year",
                "format": "Round Robin",
                "region": "Asia Pacific",
                "start_date": now + timedelta(days=30),
            },
            {
                "title": "Valorant Community Cup",
                "game_id": game_valorant.id,
                "status": "finished",
                "prize_pool": "$10,000",
                "max_teams": 4,
                "description": "Community-driven Valorant tournament",
                "format": "Single Elimination",
                "region": "NA East",
                "start_date": now - timedelta(days=14),
            },
        ]

        tournaments = []
        for td in tournaments_data:
            tournament = models.Tournament(**td)
            db.add(tournament)
            db.commit()
            db.refresh(tournament)
            tournaments.append(tournament)
            print(f"  Tournament: {tournament.title} ({tournament.status})")

        # Register teams for tournaments
        print("Registering teams for tournaments...")
        registrations = [
            (tournaments[0].id, teams[0].id),  # Void Walkers -> Valorant Champions
            (tournaments[0].id, teams[1].id),  # Crimson Surge -> Valorant Champions
            (tournaments[0].id, teams[2].id),  # Aegis Protocol -> Valorant Champions
            (tournaments[0].id, teams[3].id),  # Neon Syndicate -> Valorant Champions
            (tournaments[1].id, teams[0].id),  # Void Walkers -> Apex Predator Cup
            (tournaments[1].id, teams[4].id),  # Phantom X -> Apex Predator Cup
            (tournaments[3].id, teams[0].id),  # Void Walkers -> Community Cup
            (tournaments[3].id, teams[1].id),  # Crimson Surge -> Community Cup
        ]
        for t_id, team_id in registrations:
            reg = models.TournamentRegistration(tournament_id=t_id, team_id=team_id)
            db.add(reg)
        db.commit()
        print(f"  Registered {len(registrations)} team-tournament entries")

        # ==============================
        # Step 7: Create Matches
        # ==============================
        print("Creating matches...")

        matches_data = [
            {
                "tournament_id": tournaments[0].id,
                "team1_id": teams[0].id,
                "team2_id": teams[1].id,
                "score_team1": 13,
                "score_team2": 7,
                "status": "finished",
                "winner_id": teams[0].id,
                "match_date": now - timedelta(days=1),
            },
            {
                "tournament_id": tournaments[0].id,
                "team1_id": teams[2].id,
                "team2_id": teams[3].id,
                "score_team1": 9,
                "score_team2": 13,
                "status": "finished",
                "winner_id": teams[3].id,
                "match_date": now - timedelta(days=1, hours=2),
            },
            {
                "tournament_id": tournaments[0].id,
                "team1_id": teams[0].id,
                "team2_id": teams[3].id,
                "score_team1": 0,
                "score_team2": 0,
                "status": "live",
                "winner_id": None,
                "match_date": now,
            },
            {
                "tournament_id": tournaments[3].id,
                "team1_id": teams[0].id,
                "team2_id": teams[1].id,
                "score_team1": 13,
                "score_team2": 11,
                "status": "finished",
                "winner_id": teams[0].id,
                "match_date": now - timedelta(days=14),
            },
            {
                "tournament_id": tournaments[1].id,
                "team1_id": teams[0].id,
                "team2_id": teams[4].id,
                "score_team1": 0,
                "score_team2": 0,
                "status": "pending",
                "winner_id": None,
                "match_date": now + timedelta(days=7),
            },
            {
                "tournament_id": tournaments[0].id,
                "team1_id": teams[1].id,
                "team2_id": teams[2].id,
                "score_team1": 0,
                "score_team2": 0,
                "status": "pending",
                "winner_id": None,
                "match_date": now + timedelta(days=1),
            },
        ]

        for md in matches_data:
            match = models.Match(**md)
            db.add(match)
        db.commit()
        print(f"  Created {len(matches_data)} matches")

        # ==============================
        # Step 8: Create Server Schedules
        # ==============================
        print("Creating server schedules...")

        servers_data = [
            {
                "time": "18:00 UTC",
                "region": "NA East",
                "title": "Valorant Champions - Semi Finals",
                "server": "us-east-1.nexusarena.gg",
                "active": True,
                "tournament_id": tournaments[0].id,
            },
            {
                "time": "20:00 UTC",
                "region": "EU West",
                "title": "Apex Predator Cup - Qualifiers",
                "server": "eu-west-1.nexusarena.gg",
                "active": False,
                "tournament_id": tournaments[1].id,
            },
            {
                "time": "14:00 UTC",
                "region": "Asia Pacific",
                "title": "League Masters - Practice Lobby",
                "server": "ap-southeast-1.nexusarena.gg",
                "active": False,
                "tournament_id": tournaments[2].id,
            },
        ]

        for sd in servers_data:
            server = models.ServerSchedule(**sd)
            db.add(server)
        db.commit()
        print(f"  Created {len(servers_data)} server schedules")

        print("\n" + "=" * 50)
        print("Database seeded successfully!")
        print("=" * 50)
        print(f"\nAdmin login: admin@nexusarena.gg / admin123")
        print(f"Player login: player@nexusarena.gg / player123")
        print(f"\nTotal records:")
        print(f"  Games: {db.query(models.Game).count()}")
        print(f"  Users: {db.query(models.User).count()}")
        print(f"  Teams: {db.query(models.Team).count()}")
        print(f"  Tournaments: {db.query(models.Tournament).count()}")
        print(f"  Matches: {db.query(models.Match).count()}")
        print(f"  Server Schedules: {db.query(models.ServerSchedule).count()}")

    except Exception as e:
        db.rollback()
        print(f"\nError seeding database: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
