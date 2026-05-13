import os, sys
from dotenv import load_dotenv
from supabase import create_client
from google_api import *
from utils import *

def main():
    load_dotenv()
    load_dotenv(".env.local")

    supabase_url = require_env("SUPABASE_URL")
    service_key = require_env("SUPABASE_SERVICE_ROLE_KEY")
    google_key = require_env("GOOGLE_MAPS_API_KEY")

    location = os.getenv("SCRAPER_LOCATION", "Chico, CA")
    radius_miles = os.getenv("SCRAPER_RADIUS_MILES", "31")
    
    dry_run = "--dry-run" in sys.argv

    supabase = create_client(supabase_url, service_key)

    print(f"Geocoding {location}...")
    lat, lng = geocode_location(location, google_key)

    print(f"Searching shelters within {radius_miles} miles...")
    places = get_nearby_shelters(lat, lng, location, radius_miles, google_key)

    print(f"Found {len(places)} place results.")

    upsert_shelters(places, dry_run)
    
    


if __name__ == "__main__":
    main()
