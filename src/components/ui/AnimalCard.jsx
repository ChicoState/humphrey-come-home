/**
 * AnimalCard — clickable card showing an animal's photo, name, and breed.
 *
 * @prop {object}  animal       — animal record from Supabase
 * @prop {boolean} [showShelter] — show shelter name if available
 */
import { useNavigate } from "react-router";
import Card from "./Card";
import { Text } from "@/components/primitives";
import styles from "./AnimalCard.module.css";

export default function AnimalCard({ animal, showShelter }) {
  const navigate = useNavigate();

  return (
    <Card onClick={() => navigate(`/animals/${animal.id}`)} className={styles.card}>
      {animal.photo_url && (
        <img src={animal.photo_url} alt={animal.name} className={styles.photo} />
      )}
      <div className={styles.info}>
        <Text variant="h3" className={styles.name}>{animal.name || "Unknown"}</Text>
        <Text variant="sm" color="muted">
          {[animal.species, animal.breed].filter(Boolean).join(" - ")}
        </Text>
        {showShelter && animal.shelter_name && (
          <Text variant="xs" color="light">{animal.shelter_name}</Text>
        )}
      </div>
    </Card>
  );
}
