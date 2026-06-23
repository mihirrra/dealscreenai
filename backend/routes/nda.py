from fastapi import APIRouter
from pydantic import BaseModel
from db.supabase import supabase
from services.email import send_nda_email

router = APIRouter()

class NDARequest(BaseModel):
    broker_id: str
    session_id: str
    lead_name: str
    lead_email: str

class NDASigned(BaseModel):
    session_id: str
    lead_email: str

@router.post("/send")
async def send_nda(data: NDARequest):
    # Save NDA request in DB
    supabase.table("ndas").insert({
        "broker_id": data.broker_id,
        "session_id": data.session_id,
        "lead_name": data.lead_name,
        "lead_email": data.lead_email,
        "status": "sent"
    }).execute()

    # Send NDA email
    await send_nda_email(
        lead_name=data.lead_name,
        lead_email=data.lead_email,
        broker_id=data.broker_id
    )

    return {"message": "NDA sent successfully"}

@router.post("/signed")
async def nda_signed(data: NDASigned):
    # Update NDA status
    supabase.table("ndas")\
        .update({"status": "signed"})\
        .eq("session_id", data.session_id)\
        .execute()

    # Unlock properties for this lead
    supabase.table("leads")\
        .update({"nda_signed": True})\
        .eq("session_id", data.session_id)\
        .execute()

    return {"message": "NDA signed, properties unlocked!"}

@router.get("/status/{session_id}")
def nda_status(session_id: str):
    result = supabase.table("ndas")\
        .select("*")\
        .eq("session_id", session_id)\
        .execute()
    return result.data