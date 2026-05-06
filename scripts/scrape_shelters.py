import os
import sys
import time
from datetime import datetime, timezone

import requests
from dotenv import load_dotenv
from supabase import create_client

SOURCE_PLATFORM = "google_places"

def require_env(name):
    value = os.getenv(name)
    if not value:
        print(f"Missing required env var: {name}", file=sys.stderr)
        sys.exit(1)
    return value

def meters_from_miles(miles):
    return int(float(miles) * 1609.344)

def geocode_location(location, google_key):
    res = requests.get(
        "https://maps.googleapis.com/maps/api/geocode/json",
        params={"address": location, "key": google_key},
        timeout=20,
    )
    res.raise_for_status()
    data = res.json()

    if data.get("status") != "OK" or not data.get("results"):
        raise RuntimeError(f"Could not geocode location '{location}': {data.get('status')}")
    
    loc = data["results"][0]["geometry"]["location"]
    return loc["lat"], loc["lng"]

def nearby_shelters(lat, lng, radius_meters, google_key):
    results = []
    page_token = None

    while True:
        params = {
            "location": f"{lat},{lng}",
            "radius": radius_meters,
            "keyword": "animal shelter",
            "key": google_key,
        }

        if page_token:
            params["pagetoken"] = page_token
            time.sleep(2)

        res = requests.get(
            "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
            params=params,
            timeout=20,
        )
        res.raise_for_status()
        data = res.json()

        status = data.get("status")
        if status not in ("OK", "ZERO_RESULTS"):
            raise RuntimeError(f"Places search failed: {status} {data.get('error_message', '')}")
        
        results.extend(data.get("results", []))

        page_token = data.get("next_page_token")
        if not page_token:
            break

    return results

def place_details(place_id, google_key):
    fields = ",".join(
        [
            "place_id",
            "name",
            "website",
            "formatted_phone_number",
            "formatted_address",
            "geometry",
            "url", 
        ]
    )

    res = requests.get(
        "https://maps.googleapis.com/maps/api/place/details/json",
        params={"place_id": place_id, "fields": fields, "key": google_key},
        timeout=20
    )
    res.raise_for_status()
    data = res.json()

    if data.get("status") != "OK":
        raise RuntimeError(f"Place details failed for {place_id}: {data.get('status')}")
    
    return data["result"]

def normalize_shelter(details):
    location = details.get("geometry", {}).get("location", {})
    now = datetime.now(timezone.utc).isoformat()

    return {
        "name": details.get("name"),
        "website": details.get("website"),
        "phone": details.get("formatted_phone_number"),
        "address": details.get("formatted_address"),
        "latitude": location.get("lat"),
        "longitude": location.get("lng"),
        "source_platform": SOURCE_PLATFORM,
        "external_id": details.get("place_id"),
        "source_url": details.get("url"),
        "last_scraped_at": now,        
    }

def main():
    load_dotenv()
    load_dotenv(".env.local")

    supabase_url = require_env("SUPABASE_URL")
    service_key = require_env("SUPABASE_SERVICE_ROLE_KEY")
    google_key = require_env("GOOGLE_MAPS_API_KEY")

    location = os.getenv("SCRAPER_LOCATION", "Chico, CA")
    radius_miles = os.getenv("SCRAPER_RADIUS_MILES", "50")
    dry_run = "--dry-run" in sys.argv

    supabase = create_client(supabase_url, service_key)

    print(f"Geocoding {location}...")
    lat, lng = geocode_location(location, google_key)

    print(f"Searching shelters within {radius_miles} miles...")
    places = nearby_shelters(lat, lng, meters_from_miles(radius_miles), google_key)

    print(f"Found {len(places)} place results.")

    rows = []
    for place in places:
        place_id = place.get("place_id")
        if not place_id:
            continue

        try:
            details = place_details(place_id, google_key)
            row = normalize_shelter(details)

            if not row["name"] or not row["external_id"]:
                print(f"Skipping incomplete shelter: {place_id}")
                continue

            rows.append(row)
            print(f"Prepared: {row['name']}")
            time.sleep(0.15)

        except Exception as exc:
            print(f"Failed place {place_id}: {exc}", file=sys.stderr)

    if dry_run:
        print("\nDry run only. Rows prepared:")
        for row in rows:
            print(row)
        return

    if not rows:
        print("No shelters to upsert.")
        return

    result = (
        supabase.table("shelters")
        .upsert(rows, on_conflict="source_platform,external_id")
        .execute()
    )

    print(f"Upserted {len(result.data or [])} shelters.")


if __name__ == "__main__":
    main()