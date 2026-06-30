from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime, timezone


class ListingCreate(BaseModel):
    crop: str
    quantity: str
    price: str
    location: str
    source: Literal["manual", "voice"] = "manual"


class Listing(ListingCreate):
    id: Optional[str] = None
    createdAt: Optional[str] = None


class VoiceTranscript(BaseModel):
    transcript: str


def listing_from_doc(doc: dict) -> dict:
    doc["id"] = str(doc["_id"])
    del doc["_id"]
    return doc
