/**
 * Temporary structured metadata serializer for post descriptions.
 * This lets the app support richer lost/found report fields without
 * requiring an immediate posts table migration.
 */

const META_OPEN = "<HCH_REPORT>";
const META_CLOSE = "</HCH_REPORT>";

const LABELS = {
  species: "Species",
  breed: "Breed",
  age: "Age",
  gender: "Gender",
  size: "Size",
  color: "Color",
  microchip: "Microchip",
  event_at: "Event Date",
  contact_name: "Contact Name",
  contact_phone: "Contact Phone",
  contact_email: "Contact Email",
};

export function buildReportTitle({ mode, petName, species, breed, color }) {
  const safeMode = mode === "found" ? "Found" : "Lost";
  const cleanName = petName?.trim();
  const cleanSpecies = species?.trim();
  const cleanBreed = breed?.trim();
  const cleanColor = color?.trim();

  if (mode === "lost" && cleanName) return cleanName;
  if (mode === "found" && cleanName) return `Found: ${cleanName}`;

  const descriptor = [cleanColor, cleanBreed, cleanSpecies]
    .filter(Boolean)
    .join(" ")
    .trim();

  if (descriptor) {
    return mode === "found" ? `Found ${descriptor}` : `Lost ${descriptor}`;
  }

  return `${safeMode} Pet Report`;
}

export function buildReportDescription({ notes, meta = {} }) {
  const lines = Object.entries(meta)
    .filter(([, value]) => value != null && String(value).trim() !== "")
    .map(([key, value]) => `${key}: ${String(value).trim()}`);

  const cleanedNotes = notes?.trim() || "";

  if (!lines.length) return cleanedNotes;

  return [
    META_OPEN,
    ...lines,
    META_CLOSE,
    cleanedNotes,
  ]
    .filter(Boolean)
    .join("\n\n")
    .replace(`${META_CLOSE}\n\n`, `${META_CLOSE}\n\n`)
    .trim();
}

export function parseReportDescription(description = "") {
  const input = String(description || "");
  const start = input.indexOf(META_OPEN);
  const end = input.indexOf(META_CLOSE);

  if (start === -1 || end === -1 || end < start) {
    return { meta: {}, notes: input.trim() };
  }

  const block = input
    .slice(start + META_OPEN.length, end)
    .trim();

  const meta = {};
  block.split("\n").forEach((line) => {
    const separator = line.indexOf(":");
    if (separator === -1) return;
    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim();
    if (key && value) meta[key] = value;
  });

  const notes = `${input.slice(0, start)}${input.slice(end + META_CLOSE.length)}`.trim();
  return { meta, notes };
}

export function getReportFieldLabel(key, status) {
  if (key === "event_at") {
    return status === "found" ? "Found on" : "Last seen";
  }
  return LABELS[key] || key;
}
