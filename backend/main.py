from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import leads, properties, nda, questions, crexi
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="DealScreenAI", version="1.0.0")

# Allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(leads.router, prefix="/leads", tags=["Leads"])
app.include_router(properties.router, prefix="/properties", tags=["Properties"])
app.include_router(nda.router, prefix="/nda", tags=["NDA"])
app.include_router(questions.router, prefix="/questions", tags=["Questions"])
app.include_router(crexi.router, prefix="/crexi", tags=["Crexi"])

@app.get("/")
def root():
    return {"message": "DealScreenAI Backend Running!"}