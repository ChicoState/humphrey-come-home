import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
const GOOGLE_MAPS_API_KEY = process.env.VITE_GOOGLE_MAPS_API_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !GOOGLE_MAPS_API_KEY) {
  console.error("Missing required env vars.");
  console.error("Need SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, GOOGLE_MAPS_API_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function geocodeAddress(address) {
  const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
  url.searchParams.set("address", address);
  url.searchParams.set("key", GOOGLE_MAPS_API_KEY);

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Google geocoding HTTP ${res.status}`);
  }

  const data = await res.json();

  if (data.status === "ZERO_RESULTS") {
    return null;
  }

  if (data.status !== "OK" || !Array.isArray(data.results) || data.results.length === 0) {
    throw new Error(`Geocoding failed for "${address}": ${data.status}`);
  }

  const result = data.results[0];
  const location = result.geometry?.location;

  if (
    !location ||
    typeof location.lat !== "number" ||
    typeof location.lng !== "number"
  ) {
    throw new Error(`No usable lat/lng returned for "${address}"`);
  }

  return {
    latitude: location.lat,
    longitude: location.lng,
    formattedAddress: result.formatted_address ?? address,
    placeId: result.place_id ?? null,
  };
}

async function fetchSheltersNeedingBackfill(batchSize = 1000) {
  const { data, error } = await supabase
    .from("shelters")
    .select("id, name, address, latitude, longitude")
    .or("latitude.is.null,longitude.is.null")
    .not("address", "is", null)
    .limit(batchSize);

  if (error) {
    throw error;
  }

  return data ?? [];
}

async function updateShelterCoords(id, latitude, longitude) {
  const { error } = await supabase
    .from("shelters")
    .update({
      latitude,
      longitude,
    })
    .eq("id", id);

  if (error) {
    throw error;
  }
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const rows = await fetchSheltersNeedingBackfill();

  console.log(`Found ${rows.length} shelters needing coordinates.`);

  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (const shelter of rows) {
    const label = `[${shelter.id}] ${shelter.name}`;

    if (!shelter.address?.trim()) {
      console.log(`${label} - skipped (no address)`);
      skipped += 1;
      continue;
    }

    try {
      console.log(`${label} - geocoding "${shelter.address}"`);

      const geo = await geocodeAddress(shelter.address);

      if (!geo) {
        console.log(`${label} - skipped (no geocode result)`);
        skipped += 1;
        continue;
      }

      console.log(
        `${label} - got lat=${geo.latitude}, lng=${geo.longitude}`
      );

      if (!dryRun) {
        await updateShelterCoords(shelter.id, geo.latitude, geo.longitude);
        console.log(`${label} - updated`);
      } else {
        console.log(`${label} - dry run, not updated`);
      }

      updated += 1;

      // Keep requests from slamming the geocoder
      await sleep(150);
    } catch (err) {
      failed += 1;
      console.error(`${label} - failed: ${err.message}`);
    }
  }

  console.log("");
  console.log("Done.");
  console.log(`Updated: ${updated}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Failed:  ${failed}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});