from fastapi import APIRouter
from pydantic import BaseModel
from db.supabase import supabase
from services.ai import qualify_lead
import traceback

router = APIRouter()

class LeadMessage(BaseModel):
    broker_id: str
    session_id: str
    message: str

@router.post("/chat")
async def chat(data: LeadMessage):
    try:
        print(f"=== /leads/chat called ===")
        print(f"data: {data}")
        response = await qualify_lead(
            broker_id=data.broker_id,
            session_id=data.session_id,
            message=data.message
        )
        print(f"=== response: {response} ===")
        return response
    except Exception as e:
        print(f"=== ROUTE ERROR: {e} ===")
        traceback.print_exc()
        return {"message": "Route error", "error": str(e)}

@router.get("/all/{broker_id}")
def get_leads(broker_id: str):
    leads = supabase.table("leads")\
        .select("*")\
        .eq("broker_id", broker_id)\
        .execute()
    return leads.data