from sentence_transformers import SentenceTransformer
from db.supabase import supabase
import numpy as np

# Load embedding model (free, runs locally)
model = SentenceTransformer('all-MiniLM-L6-v2')

async def search_properties(broker_id: str, query: str):
    
    # Convert query to embedding
    query_embedding = model.encode(query).tolist()

    # Get all properties for this broker
    properties = supabase.table("properties")\
        .select("*")\
        .eq("broker_id", broker_id)\
        .execute()

    if not properties.data:
        return []

    # Score each property against query
    results = []
    for prop in properties.data:
        if prop.get("embedding"):
            prop_embedding = np.array(prop["embedding"])
            query_vec = np.array(query_embedding)
            
            # Cosine similarity
            similarity = np.dot(prop_embedding, query_vec) / (
                np.linalg.norm(prop_embedding) * np.linalg.norm(query_vec)
            )
            
            results.append({
                "property": prop,
                "score": float(similarity)
            })

    # Sort by similarity score
    results.sort(key=lambda x: x["score"], reverse=True)

    # Return top 3 matches
    return [r["property"] for r in results[:3]]


async def embed_property(property_data: dict):
    # Create text description for embedding
    text = f"""
    Type: {property_data.get('property_type')}
    Location: {property_data.get('location')}
    Price: {property_data.get('price')}
    Description: {property_data.get('description')}
    """
    
    # Generate embedding
    embedding = model.encode(text).tolist()
    
    # Save embedding to DB
    supabase.table("properties").update({
        "embedding": embedding
    }).eq("id", property_data["id"]).execute()

    return embedding