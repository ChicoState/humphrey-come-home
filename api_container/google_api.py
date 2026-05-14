import os, sys, requests

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



def get_nearby_shelters(lat, lng, location, radius_miles, google_key):
    radius_meters = meters_from_miles(radius_miles)
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
            "textQuery": f"animal shelters with {radius_miles} miles of {location}",
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


