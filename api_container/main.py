from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import os, sys
from dotenv import load_dotenv
from supabase import create_client
from google_api import *
from utils import *

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    shelters = get_nearby_shelters(lat, lng, location, radius_miles, google_key)

    print(f"Found {len(shelters)} place results.")

    if len(shelters) < 1:
        print("No Shelters found in search area.")
        return
    rows = []
    
    response = (
        supabase
        .table("shelters")
        .select("*")
        .execute()
    )
    
    existing_rows = response.data

    for location in shelters:
        row = normalize_shelter(location)

        if not row["name"] or not row["external_id"]:
            print(f"Skipping incomplete shelter: {location}")
            continue
        
        if row not in existing_rows:
            rows.append(row)
            print(f"Prepared: {row['name']}")
        else:
            print(f"{row['name']} already in database.")
    if dry_run:
        print("\nDry run only. Rows prepared:")
        for row in rows:
            print(row)
        return

    result = (
        supabase.table("shelters")
        .upsert(rows, on_conflict="source_platform,external_id")
        .execute()
    )

    print(f"Upserted {len(result.data)} shelters.")


