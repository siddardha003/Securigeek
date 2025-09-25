#!/usr/bin/env python3
"""
FastAPI Issue Tracker Application

Run with: python run.py
Or with uvicorn: uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
"""

import uvicorn
from app.main import app

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )