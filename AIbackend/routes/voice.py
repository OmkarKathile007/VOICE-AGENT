import re
from fastapi import APIRouter, HTTPException, status
from datetime import datetime, timezone

from database import get_collection
from models import Listing, VoiceTranscript, listing_from_doc

router = APIRouter(prefix="/voice", tags=["voice"])

KNOWN_CROPS = [
    "wheat", "rice", "paddy", "sugarcane", "cotton", "maize", "corn",
    "soybean", "soya", "groundnut", "peanut", "mustard", "sunflower",
    "tomato", "onion", "potato", "chilli", "pepper", "ginger", "garlic",
    "turmeric", "cumin", "coriander", "basmati", "jowar", "bajra",
    "millet", "chickpea", "chana", "lentil", "dal", "arhar", "tur",
    "moong", "urad", "peas", "mango", "banana", "guava", "pomegranate",
    "grapes", "orange", "lemon", "watermelon", "cucumber", "brinjal",
    "cauliflower", "cabbage", "spinach", "methi", "fenugreek",
]

UNIT_PATTERN = re.compile(
    r"(\d+(?:\.\d+)?)\s*(kg|kilogram|quintal|quintals|ton|tons|tonne|tonnes|"
    r"bag|bags|sack|sacks|maund|maunds|liter|litre|liters|litres)",
    re.IGNORECASE,
)

PRICE_PATTERN = re.compile(
    r"(?:rs\.?|₹|rupees?|inr)?\s*(\d+(?:,\d+)*(?:\.\d+)?)"
    r"\s*(?:rs\.?|₹|rupees?|per|each|a\s+kg|a\s+quintal)?",
    re.IGNORECASE,
)

LOCATION_PATTERN = re.compile(
    r"(?:at|in|from|market|mandi|apmc|near)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)",
)


def parse_transcript(text: str) -> dict:
    lower = text.lower()

    crop = next((c for c in KNOWN_CROPS if c in lower), None)

    qty_match = UNIT_PATTERN.search(text)
    quantity = f"{qty_match.group(1)} {qty_match.group(2)}" if qty_match else None

    price = None
    for m in PRICE_PATTERN.finditer(text):
        raw = m.group(1).replace(",", "")
        try:
            val = float(raw)
            if qty_match and abs(val - float(qty_match.group(1))) < 0.001:
                continue
            price = raw
        except ValueError:
            pass

    loc_match = LOCATION_PATTERN.search(text)
    location = loc_match.group(1) if loc_match else None

    return {"crop": crop, "quantity": quantity, "price": price, "location": location}


@router.post("/parse", response_model=dict)
async def parse_voice(body: VoiceTranscript):
    """Extract structured listing fields from a raw voice transcript."""
    parsed = parse_transcript(body.transcript)
    missing = [k for k, v in parsed.items() if not v]
    return {"parsed": parsed, "missing": missing}


@router.post("/listing", response_model=Listing, status_code=status.HTTP_201_CREATED)
async def create_from_voice(body: VoiceTranscript):
    """Parse a voice transcript and save the resulting listing to MongoDB."""
    parsed = parse_transcript(body.transcript)
    missing = [k for k, v in parsed.items() if not v]
    if missing:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Could not extract fields from transcript: {missing}",
        )

    col = get_collection("listings")
    doc = {**parsed, "source": "voice", "createdAt": datetime.now(timezone.utc).isoformat()}
    result = await col.insert_one(doc)
    created = await col.find_one({"_id": result.inserted_id})
    return listing_from_doc(created)
