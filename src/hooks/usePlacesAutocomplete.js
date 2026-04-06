/**
 * usePlacesAutocomplete — hook for Google Places autocomplete suggestions.
 * Handles debounced fetching, session tokens, and place detail resolution.
 *
 * @param {object} options
 * @param {number} [options.debounce] — debounce delay in ms (default 250)
 *
 * @returns {{
 *   suggestions: Array,
 *   fetchSuggestions: (input: string) => void,
 *   selectSuggestion: (prediction) => Promise<{ address, lat, lng }>,
 *   clearSuggestions: () => void,
 *   ready: boolean
 * }}
 */
import { useState, useRef, useCallback } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";

export default function usePlacesAutocomplete({ debounce = 250 } = {}) {
  const [suggestions, setSuggestions] = useState([]);
  const debounceRef = useRef(null);
  const sessionTokenRef = useRef(null);
  const places = useMapsLibrary("places");

  const fetchSuggestions = useCallback((input) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!input.trim()) {
      setSuggestions([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      if (!places) return;
      if (!sessionTokenRef.current) {
        sessionTokenRef.current = new places.AutocompleteSessionToken();
      }
      try {
        const { suggestions: results } =
          await places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
            input,
            sessionToken: sessionTokenRef.current,
          });
        setSuggestions(results.map((s) => s.placePrediction).filter(Boolean));
      } catch {
        setSuggestions([]);
      }
    }, debounce);
  }, [debounce, places]);

  const selectSuggestion = useCallback(async (prediction) => {
    const text = prediction.text?.toString() || "";
    setSuggestions([]);
    try {
      const place = new places.Place({ id: prediction.placeId });
      await place.fetchFields({ fields: ["location", "formattedAddress"] });
      sessionTokenRef.current = new places.AutocompleteSessionToken();
      return {
        address: place.formattedAddress || text,
        lat: place.location?.lat(),
        lng: place.location?.lng(),
      };
    } catch {
      sessionTokenRef.current = new places.AutocompleteSessionToken();
      return { address: text, lat: null, lng: null };
    }
  }, [places]);

  const clearSuggestions = useCallback(() => setSuggestions([]), []);

  return { suggestions, fetchSuggestions, selectSuggestion, clearSuggestions, ready: !!places };
}
