from fastapi import FastAPI
from pydantic import BaseModel

import os, sys
from dotenv import load_dotenv
from supabase import create_client
from google_api import *
from utils import *

app = FastAPI()

class LocationRequest(BaseModel):
    city: str
    state: str
    radius: str

def ProcessTerms(city, state):
    if len(state) < 3:
        state = state.upper()
    else:
        state = state.title()
    return f"{city.title()}, {state}"
   
@app.post("/populate")
async def AddToDataBase(req: LocationRequest):
    dry_run = False # For testing
    location = ProcessTerms(req.city, req.state)
    radius_miles = req.radius

    load_dotenv()
    load_dotenv(".env.local")

    supabase_url = require_env("SUPABASE_URL")
    service_key = require_env("SUPABASE_SERVICE_ROLE_KEY")
    google_key = require_env("GOOGLE_MAPS_API_KEY")

    supabase = create_client(supabase_url, service_key)

    print(f"Geocoding {location}...")
    lat, lng = geocode_location(location, google_key)

    print(f"Searching shelters within {radius_miles} miles...")
    places = get_nearby_shelters(lat, lng, location, radius_miles, google_key)

    print(f"Found {len(places)} place results.")

    upsert_shelters(places, dry_run)
    

