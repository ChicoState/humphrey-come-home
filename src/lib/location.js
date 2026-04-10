/**
 * Geospatial helpers used for client-side filtering and sorting.
 */

const EARTH_RADIUS_MILES = 3958.8;

function toRadians(value) {
  return (value * Math.PI) / 180;
}

function isNumber(value) {
  return typeof value === "number" && !Number.isNaN(value);
}

export function haversineMiles(lat1, lng1, lat2, lng2) {
  if (![lat1, lng1, lat2, lng2].every(isNumber)) return null;

  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_MILES * c;
}

export function formatDistance(miles) {
  if (!isNumber(miles)) return null;
  if (miles < 0.25) return "Less than 0.25 mi away";
  if (miles < 10) return `${miles.toFixed(1)} mi away`;
  return `${Math.round(miles)} mi away`;
}

export function compareDistanceThenNewest(a, b) {
  const aDistance = isNumber(a?.distanceMiles) ? a.distanceMiles : Number.POSITIVE_INFINITY;
  const bDistance = isNumber(b?.distanceMiles) ? b.distanceMiles : Number.POSITIVE_INFINITY;

  if (aDistance !== bDistance) return aDistance - bDistance;

  const aDate = a?.created_at ? new Date(a.created_at).getTime() : 0;
  const bDate = b?.created_at ? new Date(b.created_at).getTime() : 0;
  return bDate - aDate;
}
