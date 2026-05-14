import os, sys, requests, tldextract
from datetime import datetime, timezone
from dotenv import load_dotenv
from supabase import create_client
from fastapi import HTTPException

SOURCE_PLATFORM = "google_places"

def require_env(name: str) -> str:
    value = os.getenv(name)
    if not value:
        print(f"Missing required env var: {name}", file=sys.stderr)
        raise HTTPException(status_code=500, detail=f"Missing env var: {name}")
    return value

def clean_domains(urls):
    domains = []
    for url in urls:
        if url['website'] != None:
            domain_ext = tldextract.extract(url['website'])
            domains.append(f"{domain_ext.domain}.{domain_ext.suffix}")
    return domains  

def normalize_shelter(place):
    location = place.get("location", {})
    now = datetime.now(timezone.utc).isoformat()

    return {
        "name": place.get("displayName", {}).get("text"),
        "website": place.get("websiteUri"),
        "phone": place.get("nationalPhoneNumber"),
        "address": place.get("formattedAddress"),
        "latitude": location.get("latitude"),
        "longitude": location.get("longitude"),
        "source_platform": SOURCE_PLATFORM,
        "external_id": place.get("id"),
        "source_url": place.get("googleMapsUri"),
        "last_scraped_at": now,        
    }



