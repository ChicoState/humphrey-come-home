/**
 * AnimalDetail — displays a single shelter animal's profile.
 * Shows photo with extracted color gradient, name, breed, details,
 * and shelter info. Route: /animals/:id
 */
import { useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import { Building2, MapPin, Phone, SearchX, Globe } from "lucide-react";
import Button from "@/components/ui/Button";
import { VStack, HStack, Text, Container } from "@/components/primitives";
import EmptyState from "@/components/ui/EmptyState";
import Spinner from "@/components/ui/Spinner";
import { useAnimal } from "@/hooks/queries/useAnimals";
import { useShelter } from "@/hooks/queries/useShelters";
import styles from "./AnimalDetail.module.css";

export default function AnimalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: animal, isLoading, isError } = useAnimal(id);
  const { data: shelter } = useShelter(animal?.shelter_id);
  const rotation = useMemo(() => (Math.random() * 6 - 3).toFixed(1), []);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !animal) {
    return (
      <EmptyState
        icon={SearchX}
        title="Animal not found"
        subtitle="This animal may have been removed or doesn't exist."
        button={{ onPress: () => navigate(-1), label: 'Go Back' }}
      />
    );
  }

  const stats = [
    { label: "Age", value: animal.age },
    { label: "Gender", value: animal.gender },
    { label: "Size", value: animal.size },
    { label: "Color", value: animal.color },
  ].filter((d) => d.value);

  return (
    <VStack align="center">
      {animal.photo_url && (
        <div className={styles.photoHero}>
          <img
            src={animal.photo_url}
            alt={animal.name}
            className={styles.image}
            style={{ transform: `rotate(${rotation}deg)` }}
          />
        </div>
      )}

      <Container size="md">
        <VStack gap={4} style={{ paddingTop: 24 }}>
          <VStack gap={2} align="center" style={{ textAlign: 'center' }}>
            <Text variant="h1">{animal.name || "Unknown"}</Text>
            {animal.breed && (
              <Text variant="lg" color="secondary">
                {[animal.species, animal.breed].filter(Boolean).join(" · ")}
              </Text>
            )}
          </VStack>

          {stats.length > 0 && (
            <div className={styles.statRow}>
              {stats.map((s, i) => (
                <div key={s.label} className={styles.stat}>
                  <Text variant="body" weight="700">{s.value}</Text>
                  <Text variant="xs" color="secondary">{s.label}</Text>
                </div>
              ))}
            </div>
          )}

          {animal.description && (
            <VStack gap={2}>
              <Text variant="label" color="secondary">Description</Text>
              <Text variant="body">{animal.description}</Text>
            </VStack>
          )}

          {shelter && (
            <div className={styles.shelterCard}>
              <Building2 size={36} className={styles.shelterIcon} />
              <Text variant="subtitle">{shelter.name}</Text>
              <HStack gap={4} align="center" wrap justify="center">
                {shelter.address && (
                  <span className={styles.shelterDetail}>
                    <MapPin size={16} /> {shelter.address}
                  </span>
                )}
                {shelter.phone && (
                  <span className={styles.shelterDetail}>
                    <Phone size={16} /> {shelter.phone}
                  </span>
                )}
              </HStack>
              <HStack gap={3} wrap justify="center" style={{ marginTop: 8 }}>
                <Button variant="primary" size="md" icon={Building2} onClick={() => navigate(`/shelters/${shelter.id}`)}>
                  View Shelter
                </Button>
                {shelter.website && (
                  <Button variant="outline" size="md" icon={Globe} onClick={() => window.open(shelter.website, '_blank')}>
                    Website
                  </Button>
                )}
              </HStack>
            </div>
          )}
        </VStack>
      </Container>
    </VStack>
  );
}
