import resend
from dotenv import load_dotenv
import os

load_dotenv()

resend.api_key = os.getenv("RESEND_API_KEY")

async def send_nda_email(lead_name: str, lead_email: str, broker_id: str):
    
    params = {
        "from": "DealScreenAI <onboarding@resend.dev>",
        "to": [lead_email],
        "subject": "Please Sign NDA - BB2022Realty",
        "html": f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1a1a2e;">BB2022Realty - NDA Required</h2>
            
            <p>Dear {lead_name},</p>
            
            <p>Thank you for your interest in our commercial properties.</p>
            
            <p>To view our exclusive listings, please sign our 
            Non-Disclosure Agreement by clicking the button below:</p>
            
            <a href="http://localhost:3000/nda/{broker_id}" 
               style="background-color: #e94560; 
                      color: white; 
                      padding: 12px 24px; 
                      text-decoration: none; 
                      border-radius: 5px;
                      display: inline-block;
                      margin: 20px 0;">
                Sign NDA Now
            </a>
            
            <p>Once signed, you will have immediate access to:</p>
            <ul>
                <li>Hotels for sale in Illinois</li>
                <li>Gas Stations</li>
                <li>Liquor Stores</li>
                <li>Convenience Stores</li>
                <li>REO/Bank-Owned Properties</li>
            </ul>
            
            <p>Best regards,<br>
            <strong>Bharat Butani</strong><br>
            BB2022Realty<br>
            630-550-3598</p>
        </div>
        """
    }
    
    resend.Emails.send(params)


async def send_broker_alert(broker_email: str, lead_data: dict):
    
    params = {
        "from": "DealScreenAI <onboarding@resend.dev>",
        "to": [broker_email],
        "subject": f"🔥 New {lead_data.get('lead_score')} Lead - DealScreenAI",
        "html": f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1a1a2e;">New Lead Captured!</h2>
            
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
                <h3>Lead Score: 
                    <span style="color: {'#ff4444' if lead_data.get('lead_score') == 'HOT' 
                                        else '#ff8800' if lead_data.get('lead_score') == 'WARM' 
                                        else '#888888'}">
                        {lead_data.get('lead_score')}
                    </span>
                </h3>
                <p><strong>Name:</strong> {lead_data.get('lead_name')}</p>
                <p><strong>Email:</strong> {lead_data.get('lead_email')}</p>
                <p><strong>Property Type:</strong> {lead_data.get('property_type')}</p>
                <p><strong>Budget:</strong> {lead_data.get('budget')}</p>
                <p><strong>Timeline:</strong> {lead_data.get('timeline')}</p>
                <p><strong>Proof of Funds:</strong> {lead_data.get('proof_of_funds')}</p>
            </div>
            
            <p>Login to your dashboard to view full conversation:</p>
            <a href="http://localhost:3000/dashboard" 
               style="background-color: #1a1a2e; 
                      color: white; 
                      padding: 12px 24px; 
                      text-decoration: none; 
                      border-radius: 5px;
                      display: inline-block;
                      margin: 20px 0;">
                View Dashboard
            </a>
        </div>
        """
    }
    
    resend.Emails.send(params)

