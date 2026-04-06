/**
 * ShelterCard — clickable card showing a shelter's name, address, and phone.
 *
 * @prop {object} shelter — shelter record from Supabase
 */
import { useNavigate } from "react-router";
import { MapPin, Phone } from "lucide-react";
import Card from "./Card";
import { Text } from "@/components/primitives";
import styles from "./ShelterCard.module.css";

export default function ShelterCard({ shelter }) {
  const navigate = useNavigate();

  return (
    <Card onClick={() => navigate(`/shelters/${shelter.id}`)} className={styles.card}>
      <Text variant="h3">{shelter.name}</Text>
      {shelter.address && (
        <Text variant="sm" color="muted" as="p" className={styles.detail}>
          <MapPin size={14} /> {shelter.address}
        </Text>
      )}
      {shelter.phone && (
        <Text variant="sm" color="muted" as="p" className={styles.detail}>
          <Phone size={14} /> {shelter.phone}
        </Text>
      )}
    </Card>
  );
}
