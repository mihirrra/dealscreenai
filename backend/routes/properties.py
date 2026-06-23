from fastapi import APIRouter
from db.supabase import supabase
from services.rag import search_properties, embed_property

router = APIRouter()

@router.get("/search/{broker_id}")
async def search(broker_id: str, query: str):
    results = await search_properties(
        broker_id=broker_id,
        query=query
    )
    return results

@router.get("/all/{broker_id}")
def get_properties(broker_id: str):
    properties = supabase.table("properties")\
        .select("*")\
        .eq("broker_id", broker_id)\
        .execute()
    return properties.data

@router.post("/add")
async def add_property(property: dict):
    result = supabase.table("properties")\
        .insert(property)\
        .execute()
    
    # Auto embed the new property for RAG search
    if result.data:
        await embed_property(result.data[0])
    
    return result.data

@router.delete("/{property_id}")
def delete_property(property_id: str):
    result = supabase.table("properties")\
        .delete()\
        .eq("id", property_id)\
        .execute()
    return {"message": "Property deleted"}