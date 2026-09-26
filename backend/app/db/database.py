# Changes made by @MdFarhanAhmad
import os
import socket
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

def is_port_open(host: str, port: int, timeout: float = 0.2) -> bool:
    try:
        with socket.create_connection((host, port), timeout=timeout):
            return True
    except Exception:
        return False

# Determine database URL (PostgreSQL if port 5432 open, otherwise fallback to SQLite)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
db_file_path = os.path.join(BASE_DIR, "safarsetu.db").replace("\\", "/")
sqlite_url = f"sqlite:///{db_file_path}"
pg_url = settings.DATABASE_URL

use_sqlite = os.getenv("USE_SQLITE", "").lower() in ("true", "1")

if not use_sqlite and is_port_open(settings.PG_HOST, settings.PG_PORT, timeout=0.5):
    try:
        import psycopg2
        from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

        # Connect to default 'postgres' database to ensure safarsetu_db exists
        conn = psycopg2.connect(
            host=settings.PG_HOST,
            port=settings.PG_PORT,
            user=settings.PG_USER,
            password=settings.PG_PASSWORD,
            dbname="postgres",
            connect_timeout=3
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        with conn.cursor() as cursor:
            cursor.execute(f"SELECT 1 FROM pg_catalog.pg_database WHERE datname = '{settings.PG_DB}'")
            exists = cursor.fetchone()
            if not exists:
                cursor.execute(f'CREATE DATABASE "{settings.PG_DB}"')
                print(f"[Database] Created PostgreSQL database '{settings.PG_DB}'.")
        conn.close()

        engine = create_engine(
            pg_url,
            pool_pre_ping=True,
            pool_recycle=3600,
            connect_args={"connect_timeout": 5},
            echo=False
        )
        with engine.connect() as conn:
            print(f"[Database] Successfully connected to PostgreSQL at {settings.PG_HOST}:{settings.PG_PORT}/{settings.PG_DB}")
    except Exception as err:
        print(f"[Database] PostgreSQL connection error: {err}. Falling back to SQLite.")
        engine = create_engine(sqlite_url, connect_args={"check_same_thread": False}, echo=False)
else:
    engine = create_engine(sqlite_url, connect_args={"check_same_thread": False}, echo=False)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



