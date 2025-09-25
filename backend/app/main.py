from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import issues_router

# Create FastAPI application
app = FastAPI(
    title="Issue Tracker API",
    description="A simple issue tracking REST API built with FastAPI",
    version="1.0.0"
)

# Configure CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],  # Angular default dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(issues_router, prefix="", tags=["issues"])

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Issue Tracker API", 
        "version": "1.0.0",
        "docs": "/docs"
    }