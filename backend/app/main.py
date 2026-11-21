import os
from dotenv import load_dotenv
from app.database.database_manager import DatabaseManager
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.routers.auth import authrouter
from fastapi import FastAPI
import logging

load_dotenv()
db_url=os.getenv("DATABASE_URL") or ""

if not db_url:
    raise ValueError("Database URl Invalid")

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s:%(lineno)d | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)

@asynccontextmanager
async def lifespan(app:FastAPI):
    db=DatabaseManager(db_url=db_url)
    await db.create_connection()
    app.state.db=db
    yield
    await db.close_connection()

app=FastAPI(lifespan=lifespan)

origins=[
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['POST','GET'],
    allow_headers=['*']
)

app.include_router(authrouter)

@app.get("/")
async def root():
    return {
        "message":"Server Running Fine"
    }



