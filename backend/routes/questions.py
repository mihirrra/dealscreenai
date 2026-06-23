from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from db.supabase import supabase

router = APIRouter()

class QuestionsUpdate(BaseModel):
    questions: List[str]

@router.get("/{broker_id}")
def get_questions(broker_id: str):
    result = supabase.table("brokers")\
        .select("questions")\
        .eq("broker_id", broker_id)\
        .execute()
    
    if result.data and result.data[0].get("questions"):
        return {"questions": result.data[0]["questions"]}
    
    # Return default questions
    return {"questions": [
        "What type of property are you looking for? (Hotel, Gas Station, Liquor Store, Convenience Store)",
        "What is your budget range?",
        "Do you have proof of funds ready?",
        "Are you looking for on-market or off-market properties?",
        "What is your closing timeline?",
        "Are you the final decision maker?"
    ]}

@router.post("/{broker_id}")
def save_questions(broker_id: str, data: QuestionsUpdate):
    supabase.table("brokers")\
        .update({"questions": data.questions})\
        .eq("broker_id", broker_id)\
        .execute()
    
    return {"message": "Questions saved successfully"}