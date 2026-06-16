"""
Nexus Arena - Database Seed Script
Sesuai Use Case Diagram & ERD:
  - USERS (id, username, email, password_hash, role, created_at)
  - GAMES (id, name, genre, description)
  - TOURNAMENTS (id, game_id, name, start_date, end_date, status)
  - TEAMS (id, captain_id, name, logo_url, created_at)
  - TEAM_MEMBERS (id, team_id, user_id, joined_at)
  - MATCHES (id, tournament_id, team1_id, team2_id, score_team1, score_team2, match_time, status)

Run with: python seed.py
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from datetime import datetime, timedelta
from database import engine, SessionLocal, Base
import models
from auth import hash_password


def seed():
    # ============================================================
    # Step 1: Drop semua tabel dan buat ulang (fresh start)
    # ============================================================
    print("=" * 60)
    print("  NEXUS ARENA - Database Seeder")
    print("=" * 60)
    print("\n[1/8] Dropping all tables...")
    Base.metadata.drop_all(bind=engine)
    print("[1/8] Creating all tables (fresh)...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        now = datetime.utcnow()

        # ============================================================
        # Step 2: Buat Game (sesuai entitas GAMES di ERD)
        # ============================================================
        print("\n[2/8] Seeding GAMES...")
        games_data = [
            {
                "name": "Valorant",
                "genre": "FPS",
                "image_url": "https://images.unsplash.com/photo-1626686007597-5c5607b4d88a?w=400",
            },
            {
                "name": "Apex Legends",
                "genre": "Battle Royale",
                "image_url": "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400",
            },
            {
                "name": "League of Legends",
                "genre": "MOBA",
                "image_url": "https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=400",
            },
            {
                "name": "Mobile Legends",
                "genre": "MOBA",
                "image_url": "https://images.unsplash.com/photo-1614294149010-950b698f72c0?w=400",
            },
            {
                "name": "PUBG Mobile",
                "genre": "Battle Royale",
                "image_url": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
            },
        ]

        games = []
        for gd in games_data:
            g = models.Game(**gd)
            db.add(g)
            db.commit()
            db.refresh(g)
            games.append(g)
            print(f"   ✓ Game: {g.name} ({g.genre})")

        # Alias
        game_valorant = games[0]
        game_apex     = games[1]
        game_lol      = games[2]
        game_ml       = games[3]
        game_pubg     = games[4]

        # ============================================================
        # Step 3: Buat Admin User (role = 'admin')
        # ============================================================
        print("\n[3/8] Seeding ADMIN USER...")
        admin = models.User(
            name="admin",
            email="admin@nexusarena.gg",
            password=hash_password("admin123"),
            role="admin",
            status="verified",
            region="NA East",
        )
        db.add(admin)
        db.commit()
        db.refresh(admin)
        print(f"   ✓ Admin: {admin.name} | email: {admin.email} | password: admin123")

        # ============================================================
        # Step 4: Buat Player Users (role = 'player')
        # ============================================================
        print("\n[4/8] Seeding PLAYER USERS...")
        players_data = [
            # Format: name, email, password, region
            ("ShadowStep",   "player@nexusarena.gg",       "player123", "NA East"),
            ("RedViper",     "redviper@nexusarena.gg",      "player123", "EU West"),
            ("NightBlade",   "nightblade@nexusarena.gg",    "player123", "EU West"),
            ("QuantumX",     "quantumx@nexusarena.gg",      "player123", "Asia Pacific"),
            ("FrostByte",    "frostbyte@nexusarena.gg",     "player123", "NA East"),
            ("TitanBlock",   "titanblock@nexusarena.gg",    "player123", "NA East"),
            ("GlitchUser",   "glitchuser@nexusarena.gg",    "player123", "Asia Pacific"),
            ("SpecterAim",   "specteraim@nexusarena.gg",    "player123", "Asia Pacific"),
            ("BladeMaster",  "blademaster@nexusarena.gg",   "player123", "EU West"),
            ("IronWolf",     "ironwolf@nexusarena.gg",      "player123", "NA East"),
            ("CyberPhantom", "cyberphantom@nexusarena.gg",  "player123", "Asia Pacific"),
            ("StormRider",   "stormrider@nexusarena.gg",    "player123", "EU West"),
        ]

        players = []
        for (name, email, pwd, region) in players_data:
            u = models.User(
                name=name,
                email=email,
                password=hash_password(pwd),
                role="player",
                status="verified",
                region=region,
            )
            db.add(u)
            db.commit()
            db.refresh(u)
            players.append(u)
            print(f"   ✓ Player: {u.name} ({u.email})")

        # Indeks pemain untuk kemudahan referensi
        # [0]=ShadowStep [1]=RedViper [2]=NightBlade [3]=QuantumX
        # [4]=FrostByte  [5]=TitanBlock [6]=GlitchUser [7]=SpecterAim
        # [8]=BladeMaster [9]=IronWolf [10]=CyberPhantom [11]=StormRider

        # ============================================================
        # Step 5: Buat Teams + TeamMembers (sesuai ERD)
        # ============================================================
        print("\n[5/8] Seeding TEAMS & TEAM_MEMBERS...")

        teams_data = [
            {
                "name": "Void Walkers",
                "captain": players[0],   # ShadowStep
                "members": [players[1], players[2]],  # RedViper, NightBlade
                "region": "NA East",
                "logo_url": None,
            },
            {
                "name": "Crimson Surge",
                "captain": players[3],   # QuantumX
                "members": [players[4]],  # FrostByte
                "region": "EU West",
                "logo_url": None,
            },
            {
                "name": "Aegis Protocol",
                "captain": players[5],   # TitanBlock
                "members": [players[6]],  # GlitchUser
                "region": "NA East",
                "logo_url": None,
            },
            {
                "name": "Neon Syndicate",
                "captain": players[7],   # SpecterAim
                "members": [players[8]],  # BladeMaster
                "region": "Asia Pacific",
                "logo_url": None,
            },
            {
                "name": "Phantom X",
                "captain": players[9],   # IronWolf
                "members": [players[10]], # CyberPhantom
                "region": "EU West",
                "logo_url": None,
            },
            {
                "name": "Iron Veil",
                "captain": players[11],  # StormRider
                "members": [],
                "region": "Asia Pacific",
                "logo_url": None,
            },
        ]

        teams = []
        for td in teams_data:
            # Buat tim
            team = models.Team(
                name=td["name"],
                captain_id=td["captain"].id,
                region=td["region"],
                logo_url=td["logo_url"],
                status="verified",
            )
            db.add(team)
            db.commit()
            db.refresh(team)

            # Daftarkan kapten sebagai anggota dengan role 'captain'
            captain_member = models.TeamMember(
                team_id=team.id,
                user_id=td["captain"].id,
                role="captain",
                status="active",
            )
            db.add(captain_member)
            td["captain"].team_id = team.id

            # Daftarkan anggota lain dengan role 'member'
            for member_user in td["members"]:
                mem = models.TeamMember(
                    team_id=team.id,
                    user_id=member_user.id,
                    role="member",
                    status="active",
                )
                db.add(mem)
                member_user.team_id = team.id

            db.commit()
            teams.append(team)
            member_names = [m.name for m in td["members"]]
            print(f"   ✓ Tim: {team.name} | Kapten: {td['captain'].name} | Anggota: {member_names}")

        # Alias tim
        # teams[0]=Void Walkers  teams[1]=Crimson Surge  teams[2]=Aegis Protocol
        # teams[3]=Neon Syndicate teams[4]=Phantom X     teams[5]=Iron Veil

        # ============================================================
        # Step 6: Buat Tournaments (sesuai ERD: game_id, status, dll)
        # ============================================================
        print("\n[6/8] Seeding TOURNAMENTS...")

        tournaments_data = [
            {
                "title": "Valorant Champions 2025",
                "game_id": game_valorant.id,
                "status": "ongoing",
                "prize_pool": "$50,000",
                "max_teams": 8,
                "description": "Turnamen Valorant bergengsi musim 2025. Daftarkan timmu sekarang!",
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
                "description": "Battle royale terbaik di dunia, siapa yang paling tangguh?",
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
                "description": "Event League of Legends terbesar tahun ini.",
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
                "description": "Turnamen komunitas Valorant yang sudah selesai.",
                "format": "Single Elimination",
                "region": "NA East",
                "start_date": now - timedelta(days=14),
            },
            {
                "title": "Mobile Legends Open Series",
                "game_id": game_ml.id,
                "status": "open",
                "prize_pool": "$15,000",
                "max_teams": 12,
                "description": "Seri terbuka Mobile Legends untuk semua tim.",
                "format": "Group Stage + Playoffs",
                "region": "Asia Pacific",
                "start_date": now + timedelta(days=14),
            },
            {
                "title": "PUBG Invitational 2025",
                "game_id": game_pubg.id,
                "status": "upcoming",
                "prize_pool": "$30,000",
                "max_teams": 20,
                "description": "PUBG Mobile tournament level invitational.",
                "format": "Round Robin",
                "region": "Asia Pacific",
                "start_date": now + timedelta(days=45),
            },
        ]

        tournaments = []
        for td in tournaments_data:
            t = models.Tournament(**td)
            db.add(t)
            db.commit()
            db.refresh(t)
            tournaments.append(t)
            print(f"   ✓ Turnamen: {t.title} | Status: {t.status} | Hadiah: {t.prize_pool}")

        # Alias turnamen
        # tournaments[0] = Valorant Champions (ongoing)
        # tournaments[1] = Apex Predator Cup (open)
        # tournaments[2] = League Masters (upcoming)
        # tournaments[3] = Valorant Community Cup (finished)
        # tournaments[4] = Mobile Legends Open (open)
        # tournaments[5] = PUBG Invitational (upcoming)

        # ============================================================
        # Step 6b: Registrasi Tim ke Turnamen (sesuai use case:
        #          "Mengikuti Turnamen" oleh User/Player)
        # ============================================================
        print("\n   Mendaftarkan tim ke turnamen...")
        registrations = [
            # Valorant Champions (ongoing) - 4 tim
            (tournaments[0].id, teams[0].id),  # Void Walkers
            (tournaments[0].id, teams[1].id),  # Crimson Surge
            (tournaments[0].id, teams[2].id),  # Aegis Protocol
            (tournaments[0].id, teams[3].id),  # Neon Syndicate

            # Apex Predator Cup (open) - 2 tim
            (tournaments[1].id, teams[0].id),  # Void Walkers
            (tournaments[1].id, teams[4].id),  # Phantom X

            # Mobile Legends Open (open) - 3 tim
            (tournaments[4].id, teams[3].id),  # Neon Syndicate
            (tournaments[4].id, teams[5].id),  # Iron Veil
            (tournaments[4].id, teams[2].id),  # Aegis Protocol

            # Valorant Community Cup (finished) - 2 tim
            (tournaments[3].id, teams[0].id),  # Void Walkers
            (tournaments[3].id, teams[1].id),  # Crimson Surge
        ]

        for (t_id, team_id) in registrations:
            reg = models.TournamentRegistration(
                tournament_id=t_id,
                team_id=team_id,
            )
            db.add(reg)
        db.commit()
        print(f"   ✓ Total {len(registrations)} registrasi tim-turnamen berhasil")

        # ============================================================
        # Step 7: Buat Matches (sesuai ERD & flowchart Input Skor)
        # ============================================================
        print("\n[7/8] Seeding MATCHES...")

        matches_data = [
            # --- Valorant Champions 2025 (ongoing) ---
            # Semi Final 1: Void Walkers vs Crimson Surge → selesai, Void Walkers menang
            {
                "tournament_id": tournaments[0].id,
                "team1_id": teams[0].id,
                "team2_id": teams[1].id,
                "score_team1": 13,
                "score_team2": 7,
                "status": "finished",
                "winner_id": teams[0].id,
                "match_date": now - timedelta(days=1, hours=4),
            },
            # Semi Final 2: Aegis Protocol vs Neon Syndicate → selesai, Neon Syndicate menang
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
            # Grand Final: Void Walkers vs Neon Syndicate → sedang live
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

            # --- Valorant Community Cup (finished) ---
            # Final: Void Walkers vs Crimson Surge → selesai, Void Walkers menang
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

            # --- Apex Predator Cup (open, belum mulai) ---
            # Match 1 dijadwalkan
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

            # --- Mobile Legends Open (open) ---
            # Match 1 dijadwalkan
            {
                "tournament_id": tournaments[4].id,
                "team1_id": teams[3].id,
                "team2_id": teams[5].id,
                "score_team1": 0,
                "score_team2": 0,
                "status": "pending",
                "winner_id": None,
                "match_date": now + timedelta(days=14),
            },
            # Match 2 dijadwalkan
            {
                "tournament_id": tournaments[4].id,
                "team1_id": teams[2].id,
                "team2_id": teams[3].id,
                "score_team1": 0,
                "score_team2": 0,
                "status": "pending",
                "winner_id": None,
                "match_date": now + timedelta(days=15),
            },
        ]

        created_matches = []
        for md in matches_data:
            match = models.Match(**md)
            db.add(match)
            db.commit()
            db.refresh(match)
            created_matches.append(match)
            t1 = db.query(models.Team).filter(models.Team.id == match.team1_id).first()
            t2 = db.query(models.Team).filter(models.Team.id == match.team2_id).first()
            print(f"   ✓ Match [{match.status}]: {t1.name} vs {t2.name} "
                  f"({match.score_team1}-{match.score_team2})")

        # ============================================================
        # Step 8: Buat Server Schedules (jadwal server pertandingan)
        # ============================================================
        print("\n[8/8] Seeding SERVER SCHEDULES...")

        servers_data = [
            {
                "time": "18:00 UTC",
                "region": "NA East",
                "title": "Valorant Champions - Grand Final",
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
            {
                "time": "16:00 UTC",
                "region": "Asia Pacific",
                "title": "Mobile Legends Open - Group Stage",
                "server": "ap-southeast-2.nexusarena.gg",
                "active": False,
                "tournament_id": tournaments[4].id,
            },
        ]

        for sd in servers_data:
            server = models.ServerSchedule(**sd)
            db.add(server)
        db.commit()
        print(f"   ✓ {len(servers_data)} server schedules berhasil dibuat")

        # ============================================================
        # RINGKASAN HASIL SEEDING
        # ============================================================
        print("\n" + "=" * 60)
        print("  DATABASE SEEDING BERHASIL!")
        print("=" * 60)

        print("\n📌 AKUN LOGIN:")
        print("  ┌─ ADMIN ─────────────────────────────────")
        print("  │  Email   : admin@nexusarena.gg")
        print("  │  Password: admin123")
        print("  │  Hak     : Kelola game, turnamen, match, user, tim")
        print("  │")
        print("  └─ PLAYER (contoh) ───────────────────────")
        print("  │  Email   : player@nexusarena.gg")
        print("  │  Password: player123")
        print("  │  Hak     : Registrasi, buat tim, ikut turnamen")
        print("  └─────────────────────────────────────────")

        print("\n📊 TOTAL DATA:")
        print(f"   Games             : {db.query(models.Game).count()}")
        print(f"   Users (total)     : {db.query(models.User).count()}")
        print(f"   Users (admin)     : {db.query(models.User).filter(models.User.role == 'admin').count()}")
        print(f"   Users (player)    : {db.query(models.User).filter(models.User.role == 'player').count()}")
        print(f"   Teams             : {db.query(models.Team).count()}")
        print(f"   Team Members      : {db.query(models.TeamMember).count()}")
        print(f"   Tournaments       : {db.query(models.Tournament).count()}")
        print(f"   Registrations     : {db.query(models.TournamentRegistration).count()}")
        print(f"   Matches           : {db.query(models.Match).count()}")
        print(f"   Server Schedules  : {db.query(models.ServerSchedule).count()}")

        print("\n🔗 RELASI DATABASE (sesuai ERD):")
        print("   USERS ──── memiliki ────▶ TEAMS (via captain_id)")
        print("   USERS ──── terdaftar ───▶ TEAM_MEMBERS (via user_id)")
        print("   GAMES ──── memiliki ────▶ TOURNAMENTS (via game_id)")
        print("   TEAMS ──── mengikuti ───▶ TOURNAMENT_REGISTRATIONS")
        print("   TEAMS ──── bertanding ──▶ MATCHES (team1_id / team2_id)")
        print("   TOURNAMENTS ── menyelenggarakan ──▶ MATCHES")
        print("=" * 60)

    except Exception as e:
        db.rollback()
        print(f"\n❌ Error seeding database: {e}")
        import traceback
        traceback.print_exc()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
