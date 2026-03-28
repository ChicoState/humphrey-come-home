/**
 * SuggestionList — dropdown list of Places autocomplete suggestions.
 *
 * @prop {Array}   suggestions  — place predictions from usePlacesAutocomplete
 * @prop {number}  activeIndex  — currently highlighted index (-1 for none)
 * @prop {function} onSelect    — called with the prediction when clicked
 * @prop {function} onHover     — called with the index on mouse enter
 * @prop {"above"|"below"} [position] — render above or below the trigger (default "above")
 */
import { MapPin } from "lucide-react";
import styles from "./SuggestionList.module.css";

export default function SuggestionList({ suggestions, activeIndex = -1, onSelect, onHover, position = "above" }) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <ul className={`${styles.list} ${position === "below" ? styles.below : ""}`} role="listbox">
      {suggestions.map((prediction, index) => (
        <li
          key={prediction.placeId}
          role="option"
          aria-selected={index === activeIndex}
          className={`${styles.item} ${index === activeIndex ? styles.itemActive : ""}`}
          onMouseDown={() => onSelect(prediction)}
          onMouseEnter={() => onHover?.(index)}
        >
          <MapPin size={18} strokeWidth={1.8} className={styles.icon} />
          <span>{prediction.text?.toString()}</span>
        </li>
      ))}
    </ul>
  );
}
