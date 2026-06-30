from fastapi import APIRouter, HTTPException, status
from bson import ObjectId
from datetime import datetime, timezone

from database import get_collection
from models import Listing, ListingCreate, listing_from_doc

router = APIRouter(prefix="/listings", tags=["listings"])


@router.get("", response_model=list[Listing])
async def get_listings():
    col = get_collection("listings")
    cursor = col.find().sort("createdAt", -1)
    return [listing_from_doc(doc) async for doc in cursor]


@router.post("", response_model=Listing, status_code=status.HTTP_201_CREATED)
async def create_listing(data: ListingCreate):
    col = get_collection("listings")
    doc = data.model_dump()
    doc["createdAt"] = datetime.now(timezone.utc).isoformat()

    result = await col.insert_one(doc)
    created = await col.find_one({"_id": result.inserted_id})
    return listing_from_doc(created)


@router.delete("/{listing_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_listing(listing_id: str):
    if not ObjectId.is_valid(listing_id):
        raise HTTPException(status_code=400, detail="Invalid listing ID")

    col = get_collection("listings")
    result = await col.delete_one({"_id": ObjectId(listing_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Listing not found")
