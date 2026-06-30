from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
if not MONGODB_URI:
    raise RuntimeError("MONGODB_URI is not set. Add it to your .env file.")

DB_NAME = os.getenv("DB_NAME", "krishi_shetra")

_client: AsyncIOMotorClient | None = None
_db = None


async def connect_db():
    global _client, _db
    # Client is created here (inside async startup) so the SRV DNS lookup
    # happens at runtime, not at import time.
    _client = AsyncIOMotorClient(MONGODB_URI, serverSelectionTimeoutMS=5000)
    await _client.admin.command("ping")
    _db = _client[DB_NAME]
    print("✓ Connected to MongoDB Atlas")


async def close_db():
    if _client:
        _client.close()


def get_collection(name: str):
    if _db is None:
        raise RuntimeError("DB not initialised — connect_db() not called yet.")
    return _db[name]
