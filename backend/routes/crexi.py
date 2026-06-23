from fastapi import APIRouter, Request
from pydantic import BaseModel
from services.parser import parse_crexi_email

router = APIRouter()

class EmailData(BaseModel):
    broker_id: str
    email_body: str
    subject: str = ""

@router.post("/parse")
async def parse_email(data: EmailData):
    print(f"=== Crexi email received ===")
    print(f"Subject: {data.subject}")
    
    result = await parse_crexi_email(
        email_body=data.email_body,
        broker_id=data.broker_id
    )
    
    if result:
        return {
            "message": "Property extracted and saved!",
            "property": result
        }
    else:
        return {
            "message": "Could not extract property details",
            "property": None
        }

@router.post("/test")
async def test_parser():
    # Test with sample Crexi email
    sample_email = """
    New Listing Alert - Crexi
    
    Property: Holiday Inn Express
    Location: Chicago, IL 60601
    Price: $3,500,000
    Cap Rate: 7.2%
    Rooms: 85
    Year Built: 2005
    
    This well-maintained hotel is located in downtown Chicago.
    Strong occupancy rates averaging 78% annually.
    Recent renovation completed in 2022.
    
    Contact: broker@crexi.com
    Listing ID: CRX-12345
    """
    
    result = await parse_crexi_email(
        email_body=sample_email,
        broker_id="bb2022realty"
    )
    
    return {"result": result}