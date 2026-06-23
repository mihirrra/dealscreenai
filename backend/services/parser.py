from groq import Groq
from db.supabase import supabase
from services.rag import embed_property
from dotenv import load_dotenv
import os
import json

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

async def parse_crexi_email(email_body: str, broker_id: str):
    print(f"=== Parsing Crexi email ===")
    
    try:
        # Use AI to extract property details from email
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": """You are a real estate data extractor. 
Extract property details from Crexi listing emails.
Respond ONLY in pure JSON format:
{
    "property_type": "Hotel/Gas Station/Liquor Store/Convenience Store/Other",
    "location": "City, State",
    "price": "$X,XXX,XXX",
    "description": "brief description",
    "cap_rate": "X%",
    "size": "square footage or rooms",
    "year_built": "year"
}
If any field is not found, use null."""
                },
                {
                    "role": "user",
                    "content": f"Extract property details from this email:\n\n{email_body}"
                }
            ],
            temperature=0.1
        )

        ai_response = response.choices[0].message.content
        print(f"AI extracted: {ai_response}")

        # Parse JSON
        if "{" in ai_response:
            json_start = ai_response.index("{")
            json_end = ai_response.rindex("}") + 1
            property_data = json.loads(ai_response[json_start:json_end])
        else:
            return None

        # Build full description
        description_parts = []
        if property_data.get("description"):
            description_parts.append(property_data["description"])
        if property_data.get("cap_rate"):
            description_parts.append(f"Cap Rate: {property_data['cap_rate']}")
        if property_data.get("size"):
            description_parts.append(f"Size: {property_data['size']}")
        if property_data.get("year_built"):
            description_parts.append(f"Year Built: {property_data['year_built']}")

        # Save to Supabase
        new_property = {
            "broker_id": broker_id,
            "property_type": property_data.get("property_type", "Other"),
            "location": property_data.get("location", "Illinois"),
            "price": property_data.get("price", "Contact for price"),
            "description": " | ".join(description_parts),
            "source": "crexi"
        }

        result = supabase.table("properties").insert(new_property).execute()

        # Auto embed for RAG search
        if result.data:
            await embed_property(result.data[0])
            print(f"=== Property saved and embedded ===")
            return result.data[0]

    except Exception as e:
        print(f"Parser error: {e}")
        return None