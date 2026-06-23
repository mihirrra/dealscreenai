from groq import Groq
from db.supabase import supabase
from dotenv import load_dotenv
import os
import json
import traceback
import resend

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))
resend.api_key = os.getenv("RESEND_API_KEY")

DEFAULT_QUESTIONS = [
    "What type of property are you looking for? (Hotel, Gas Station, Liquor Store, Convenience Store)",
    "What is your budget range?",
    "Do you have proof of funds ready?",
    "Are you looking for on-market or off-market properties?",
    "What is your closing timeline?",
    "Are you the final decision maker?"
]

def get_broker_questions(broker_id: str):
    try:
        result = supabase.table("brokers")\
            .select("questions")\
            .eq("broker_id", broker_id)\
            .execute()
        if result.data and result.data[0].get("questions"):
            return result.data[0]["questions"]
    except:
        pass
    return DEFAULT_QUESTIONS

async def qualify_lead(broker_id: str, session_id: str, message: str):
    print(f"=== qualify_lead called ===")
    print(f"broker_id: {broker_id}, message: {message}")

    try:
        history = supabase.table("conversations")\
            .select("*")\
            .eq("session_id", session_id)\
            .order("created_at")\
            .execute()

        print(f"History fetched: {len(history.data)} messages")

        messages = [
            {
                "role": "system",
                "content": f"""You are an AI assistant for BB2022Realty, a commercial real estate broker in Illinois.

Your job is to qualify buyers by asking these questions one by one:
{json.dumps(get_broker_questions(broker_id), indent=2)}

Rules:
- First collect the buyer's name and email before asking other questions
- Ask ONE question at a time
- Be professional and friendly
- After all questions answered, set trigger_nda to true
- Score the lead: HOT (proof of funds + clear timeline), WARM (interested but unclear), COLD (no funds/timeline)
- IMPORTANT: Respond ONLY in pure JSON format. No extra text before or after JSON.
- IMPORTANT: Never include the JSON structure in the message field.

Response format STRICTLY:
{{
    "message": "your conversational response here only",
    "questions_done": false,
    "lead_score": "PENDING",
    "trigger_nda": false,
    "lead_name": "extracted name or null",
    "lead_email": "extracted email or null",
    "property_type": "extracted property type or null",
    "budget": "extracted budget or null",
    "proof_of_funds": "yes/no/null",
    "on_off_market": "on/off/null",
    "timeline": "extracted timeline or null",
    "decision_maker": "yes/no/null"
}}"""
            }
        ]

        for conv in history.data:
            messages.append({
                "role": conv["role"],
                "content": conv["message"]
            })

        messages.append({
            "role": "user",
            "content": message
        })

        print(f"Calling Groq API...")

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            temperature=0.7
        )

        ai_message = response.choices[0].message.content
        print(f"Groq response: {ai_message}")

        try:
            if "{" in ai_message:
                json_start = ai_message.index("{")
                json_end = ai_message.rindex("}") + 1
                json_str = ai_message[json_start:json_end]
                ai_data = json.loads(json_str)
            else:
                ai_data = {
                    "message": ai_message,
                    "questions_done": False,
                    "lead_score": "PENDING",
                    "trigger_nda": False,
                    "lead_name": None,
                    "lead_email": None,
                    "property_type": None,
                    "budget": None,
                    "proof_of_funds": None,
                    "on_off_market": None,
                    "timeline": None,
                    "decision_maker": None
                }
        except:
            ai_data = {
                "message": ai_message,
                "questions_done": False,
                "lead_score": "PENDING",
                "trigger_nda": False,
                "lead_name": None,
                "lead_email": None,
                "property_type": None,
                "budget": None,
                "proof_of_funds": None,
                "on_off_market": None,
                "timeline": None,
                "decision_maker": None
            }

        print(f"Saving to Supabase...")

        supabase.table("conversations").insert({
            "session_id": session_id,
            "broker_id": broker_id,
            "role": "user",
            "message": message
        }).execute()

        supabase.table("conversations").insert({
            "session_id": session_id,
            "broker_id": broker_id,
            "role": "assistant",
            "message": ai_data["message"]
        }).execute()

        lead_data = {
            "session_id": session_id,
            "broker_id": broker_id,
            "lead_score": ai_data.get("lead_score", "PENDING"),
            "nda_signed": False
        }

        if ai_data.get("lead_name"):
            lead_data["lead_name"] = ai_data["lead_name"]
        if ai_data.get("lead_email"):
            lead_data["lead_email"] = ai_data["lead_email"]
        if ai_data.get("property_type"):
            lead_data["property_type"] = ai_data["property_type"]
        if ai_data.get("budget"):
            lead_data["budget"] = ai_data["budget"]
        if ai_data.get("proof_of_funds"):
            lead_data["proof_of_funds"] = ai_data["proof_of_funds"]
        if ai_data.get("on_off_market"):
            lead_data["on_off_market"] = ai_data["on_off_market"]
        if ai_data.get("timeline"):
            lead_data["timeline"] = ai_data["timeline"]
        if ai_data.get("decision_maker"):
            lead_data["decision_maker"] = ai_data["decision_maker"]

        supabase.table("leads").upsert(lead_data, on_conflict="session_id").execute()

        if ai_data.get("lead_score") == "HOT":
            try:
                resend.Emails.send({
                    "from": "onboarding@resend.dev",
                    "to": ["mihir2334@gmail.com"],
                    "subject": "🔥 HOT Lead Alert - DealScreenAI",
                    "html": f"""
                    <h2>New HOT Lead!</h2>
                    <p><strong>Name:</strong> {lead_data.get('lead_name', 'Unknown')}</p>
                    <p><strong>Email:</strong> {lead_data.get('lead_email', 'Unknown')}</p>
                    <p><strong>Property Type:</strong> {lead_data.get('property_type', 'Unknown')}</p>
                    <p><strong>Budget:</strong> {lead_data.get('budget', 'Unknown')}</p>
                    <p><strong>Timeline:</strong> {lead_data.get('timeline', 'Unknown')}</p>
                    <p><strong>Proof of Funds:</strong> {lead_data.get('proof_of_funds', 'Unknown')}</p>
                    """
                })
                print(f"=== HOT LEAD EMAIL SENT ===")
            except Exception as email_error:
                print(f"Email error: {email_error}")

        print(f"=== Success: {ai_data} ===")
        return ai_data

    except Exception as e:
        print(f"=== ERROR: {e} ===")
        traceback.print_exc()
        return {
            "message": "Sorry, something went wrong. Please try again.",
            "questions_done": False,
            "lead_score": "PENDING",
            "trigger_nda": False
        }