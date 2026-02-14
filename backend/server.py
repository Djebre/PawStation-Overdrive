from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Score Models
class ScoreSubmission(BaseModel):
    name: str
    score: int
    game_type: str = "groove-orbit-runner"  # Default to game A

class Score(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    score: int
    game_type: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class LeaderboardEntry(BaseModel):
    name: str
    score: int
    game_type: str
    timestamp: str
    rank: Optional[int] = None

# Routes
@api_router.get("/")
async def root():
    return {"message": "Space Groove Arcade API"}

@api_router.post("/score", response_model=Score)
async def submit_score(submission: ScoreSubmission):
    """Submit a new score to the leaderboard"""
    score_obj = Score(
        name=submission.name,
        score=submission.score,
        game_type=submission.game_type
    )
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = score_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    await db.scores.insert_one(doc)
    return score_obj

@api_router.get("/leaderboard", response_model=List[LeaderboardEntry])
async def get_leaderboard(game_type: Optional[str] = None, limit: int = 100):
    """Get leaderboard - optionally filtered by game type"""
    query = {}
    if game_type:
        query['game_type'] = game_type
    
    # Get scores sorted by score descending
    scores = await db.scores.find(query, {"_id": 0}).sort("score", -1).limit(limit).to_list(limit)
    
    # Convert timestamps and add rank
    leaderboard = []
    for idx, score in enumerate(scores, 1):
        if isinstance(score['timestamp'], str):
            timestamp_str = score['timestamp']
        else:
            timestamp_str = score['timestamp'].isoformat()
        
        leaderboard.append(LeaderboardEntry(
            name=score['name'],
            score=score['score'],
            game_type=score['game_type'],
            timestamp=timestamp_str,
            rank=idx
        ))
    
    return leaderboard

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()