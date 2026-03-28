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
import { useState, useRef, useEffect, useCallback } from "react";

export default function usePlacesAutocomplete({ debounce = 250 } = {}) {
  const [suggestions, setSuggestions] = useState([]);
  const [ready, setReady] = useState(false);
  const debounceRef = useRef(null);
  const sessionTokenRef = useRef(null);

  useEffect(() => {
    const check = () => {
      if (window.google?.maps?.places?.AutocompleteSuggestion) {
        setReady(true);
        return true;
      }
      return false;
    };
    if (check()) return;
    const interval = setInterval(() => {
      if (check()) clearInterval(interval);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const fetchSuggestions = useCallback((input) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!input.trim()) {
      setSuggestions([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      if (!window.google?.maps?.places?.AutocompleteSuggestion) return;
      if (!sessionTokenRef.current) {
        sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken();
      }
      try {
        const { suggestions: results } =
          await window.google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
            input,
            sessionToken: sessionTokenRef.current,
          });
        setSuggestions(results.map((s) => s.placePrediction).filter(Boolean));
      } catch {
        setSuggestions([]);
      }
    }, debounce);
  }, [debounce]);

  const selectSuggestion = useCallback(async (prediction) => {
    const text = prediction.text?.toString() || "";
    setSuggestions([]);
    try {
      const { Place } = window.google.maps.places;
      const place = new Place({ id: prediction.placeId });
      await place.fetchFields({ fields: ["location", "formattedAddress"] });
      sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken();
      return {
        address: place.formattedAddress || text,
        lat: place.location?.lat(),
        lng: place.location?.lng(),
      };
    } catch {
      sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken();
      return { address: text, lat: null, lng: null };
    }
  }, []);

  const clearSuggestions = useCallback(() => setSuggestions([]), []);

  return { suggestions, fetchSuggestions, selectSuggestion, clearSuggestions, ready };
}
