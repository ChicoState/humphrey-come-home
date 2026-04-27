/**
 * LocationInput — address search powered by Google Places Autocomplete.
 *
 * @prop {string}   value            — current text in the input
 * @prop {function} onChange         — called with the text string on typing
 * @prop {function} [onSubmit]       — called with { address, lat, lng } when a suggestion is selected
 * @prop {function} [onCameraAction] — optional camera icon action (unused for now)
 * @prop {string}   [placeholder]
 * @prop {string}   [error]          — error message to display
 * @prop {boolean}  [dropDown]       — renders suggestions in a dropdown panel vs. inline list
 *
 * Also provides a "use my location" geolocation button.
 */
import { useState, useRef, useEffect, useCallback } from "react";
import { ArrowUp, Camera, MapPin } from "lucide-react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { HStack } from "@/components/primitives";
import Button from "@/components/ui/Button";
import SuggestionList from "@/components/ui/SuggestionList";
import usePlacesAutocomplete from "@/hooks/usePlacesAutocomplete";
import styles from "./LocationInput.module.css";

export default function LocationInput({
  value,
  onChange,
  onSubmit,
  onCameraAction,
  placeholder = "Search by address, city, or ZIP code",
  error,
  dropDown = false,
}) {
  const [inputValue, setInputValue] = useState(value?.address ?? "");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [locating, setLocating] = useState(false);

  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

  const geocodingLib = useMapsLibrary("geocoding");
  const places = usePlacesAutocomplete();
  const suggestions = places.suggestions;

  useEffect(() => {
    setInputValue(value?.address ?? "");
  }, [value]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Show/hide suggestions when they change
  useEffect(() => {
    setShowSuggestions(suggestions.length > 0);
    setActiveIndex(-1);
  }, [suggestions]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);

  onChange?.({
    address: val,
    lat: null,
    lng: null,
  });

    if (places.ready) {
      places.fetchSuggestions(val);
    }
    if (!val.trim()) {
      onChange?.({ address: "", lat: null, lng: null });
    }
  };

  const selectSuggestion = useCallback(async (prediction) => {
    setShowSuggestions(false);
    const result = await places.selectSuggestion(prediction);
    setInputValue(result.address);
    onChange?.(result);
  }, [onChange, places]);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown" && showSuggestions) {
      e.preventDefault();
      setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp" && showSuggestions) {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        selectSuggestion(suggestions[activeIndex]);
      } else if (value?.lat != null) {
        onSubmit?.();
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        let address = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        try {
          if (!geocodingLib) throw new Error("Geocoding not loaded");
          const geocoder = new geocodingLib.Geocoder();
          const { results } = await geocoder.geocode({ location: { lat: latitude, lng: longitude } });
          if (results?.[0]) address = results[0].formatted_address;
        } catch { /* use coordinate fallback */ }
        setLocating(false);
        setInputValue(address);
        onChange?.({ address, lat: latitude, lng: longitude });
      },
      () => setLocating(false),
    );
  };

 const canSubmit = Boolean(inputValue.trim());

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <div className={styles.card}>
        <input
          ref={inputRef}
          type="text"
          className={styles.searchInput}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
          placeholder={placeholder}
          aria-label="Location"
          aria-expanded={showSuggestions}
          aria-autocomplete="list"
          autoComplete="off"
        />

        <HStack align="center" wrap gap={1}>
          {onCameraAction && (
            <Button variant="secondary" size="sm" icon={Camera} onClick={onCameraAction}>
              Photo
            </Button>
          )}
          <Button variant="secondary" size="sm" icon={MapPin} onClick={handleUseMyLocation} disabled={locating}>
            {locating ? "Locating..." : "Near Me"}
          </Button>
          <div className={styles.spacer} />
          <Button variant="primary" size="sm" icon={ArrowUp} disabled={!canSubmit} onClick={onSubmit} aria-label="Submit search" />
        </HStack>

        {error && <p className={styles.errorMessage} role="alert">{error}</p>}
      </div>

      {showSuggestions && (
        <SuggestionList
          suggestions={suggestions}
          activeIndex={activeIndex}
          onSelect={selectSuggestion}
          onHover={setActiveIndex}
          position={dropDown ? "below" : "above"}
        />
      )}
    </div>
  );
}
