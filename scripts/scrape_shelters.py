import os
import sys
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
    field_mask = ",".join(
        [
            "places.id",
            "places.displayName",
            "places.websiteUri",
            "places.nationalPhoneNumber",
            "places.formattedAddress",
            "places.location",
            "places.googleMapsUri",
            "places.types",
        ]
    )

    res = requests.post(
        "https://places.googleapis.com/v1/places:searchText",
        headers={
            "Content-Type": "application/json",
            "X-Goog-Api-Key": google_key,
            "X-Goog-FieldMask": field_mask,
        },
        json={
            "textQuery": "animal shelters near Chico, CA",
            "locationBias": {
                "circle": {
                    "center": {
                        "latitude": lat,
                        "longitude": lng,
                    },
                    "radius": radius_meters,
                }
            },
            "maxResultCount": 20,
        },
        timeout=20,
    )

    if not res.ok:
        print(res.text, file=sys.stderr)
        
    res.raise_for_status()
    data = res.json()
    return data.get("places", [])

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
    places = nearby_shelters(lat, lng, meters_from_miles(radius_miles), google_key)

    print(f"Found {len(places)} place results.")

    rows = []
    for place in places:
        row = normalize_shelter(place)

        if not row["name"] or not row["external_id"]:
            print(f"Skipping incomplete shelter: {place}")
            continue

        rows.append(row)
        print(f"Prepared: {row['name']}")

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
