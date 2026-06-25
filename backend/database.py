from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker

# Koneksi ke MySQL XAMPP (database: nexus_arena, user: root, tanpa password)
SQLALCHEMY_DATABASE_URL = "mysql+pymysql://root:@localhost/nexus_arena"

# Engine = koneksi utama ke database
engine = create_engine(
    SQLALCHEMY_DATABASE_URL
)

# Session digunakan untuk setiap query/transaksi ke database
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class untuk semua model/tabel database
Base = declarative_base()

# Dependency FastAPI — dipakai di setiap endpoint yang butuh koneksi DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
