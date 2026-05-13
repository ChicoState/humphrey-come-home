import os, sys, requests
from datetime import datetime, timezone
from dotenv import load_dotenv
from supabase import create_client

SOURCE_PLATFORM = "google_places"

def require_env(name):
    value = os.getenv(name)
    if not value:
        print(f"Missing required env var: {name}", file=sys.stderr)
        sys.exit(1)
    return value

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

def upsert_shelters(shelters, dry_run):
    if len(shelters) < 1:
        print("No Shelters found in search area.")
        return
    rows = []

    for location in shelters:
        row = normalize_shelter(location)

        if not row["name"] or not row["external_id"]:
            print(f"Skipping incomplete shelter: {location}")
            continue

        rows.append(row)
        print(f"Prepared: {row['name']}")

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




