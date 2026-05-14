const DEFAULT_POPULATE_URL = "https://shelter-scraper-api-109112870089.us-west1.run.app/populate";
const MAX_GOOGLE_RADIUS_MILES = 31;

export function getPopulateRadius(radius) {
  const parsed = Number(radius);
  if (!Number.isFinite(parsed) || parsed <= 0) return "25";
  return String(Math.min(parsed, MAX_GOOGLE_RADIUS_MILES));
}

export function parseCityState(address) {
  const value = String(address || "").trim();
  if (!value) return null;

  const commaParts = value.split(",").map((part) => part.trim()).filter(Boolean);
  const statePartIndex = commaParts.findIndex((part) => /\b[A-Z]{2}\b/.test(part));

  if (statePartIndex > 0) {
    const stateMatch = commaParts[statePartIndex].match(/\b([A-Z]{2})\b/);
    return {
      city: commaParts[statePartIndex - 1],
      state: stateMatch?.[1],
    };
  }

  const compactMatch = value.match(/^(.+?)\s+([A-Za-z]{2})(?:\s+\d{5}(?:-\d{4})?)?$/);
  if (compactMatch) {
    return {
      city: compactMatch[1].trim(),
      state: compactMatch[2].toUpperCase(),
    };
  }

  return null;
}

export async function populateShelters({ address, radius }) {
  const parsed = parseCityState(address);
  if (!parsed?.city || !parsed?.state) return { skipped: true };

  const endpoint = import.meta.env.VITE_SHELTER_POPULATE_URL || DEFAULT_POPULATE_URL;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      city: parsed.city,
      state: parsed.state,
      radius: getPopulateRadius(radius),
    }),
  });

  if (!response.ok) {
    throw new Error(`Shelter populate failed with ${response.status}`);
  }

  return { skipped: false };
}
