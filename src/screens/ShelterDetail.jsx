/**
 * ShelterDetail — shelter info + animals at this shelter.
 * Route: /shelters/:id
 */
import { useParams, useNavigate } from "react-router";
import { Building2, MapPin, Phone, Globe, PawPrint } from "lucide-react";
import AnimalCard from "@/components/ui/AnimalCard";
import EmptyState from "@/components/ui/EmptyState";
import Spinner from "@/components/ui/Spinner";
import { VStack, Text, Container, Divider } from "@/components/primitives";
import { useShelter } from "@/hooks/queries/useShelters";
import { useAnimals } from "@/hooks/queries/useAnimals";
import styles from "./ShelterDetail.module.css";

export default function ShelterDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: shelter, isLoading: shelterLoading } = useShelter(id);
  const { data: animals, isLoading: animalsLoading } = useAnimals({ shelterId: id });

  if (shelterLoading) {
    return <div className={styles.loading}><Spinner size="lg" /></div>;
  }

  if (!shelter) {
    return (
      <EmptyState
        icon={Building2}
        title="Shelter not found"
        button={{ onPress: () => navigate(-1), label: "Go Back" }}
      />
    );
  }

  return (
    <VStack align="center" style={{ textAlign: "center" }}>
      <VStack gap={4} align="center" paddingX={6} style={{ marginBottom: 24 }}>
        <Text variant="h1">{shelter.name}</Text>

        <div className={styles.details}>
          {shelter.address && (
            <span className={styles.detail}>
              <MapPin size={14} /> {shelter.address}
            </span>
          )}
          {shelter.phone && (
            <span className={styles.detail}>
              <Phone size={14} /> {shelter.phone}
            </span>
          )}
          {shelter.website && (
            <span className={styles.detail}>
              <Globe size={14} />{" "}
              <a href={shelter.website} target="_blank" rel="noopener noreferrer">
                Website
              </a>
            </span>
          )}
        </div>
      </VStack>

      <Container size="lg" padding={0} style={{ paddingTop: 24 }}>
        <Divider label="Animals" />

        {animalsLoading ? (
          <div className={styles.loading}><Spinner size="lg" /></div>
        ) : animals?.length > 0 ? (
          <div className={styles.animalGrid}>
            {animals.map((animal) => (
              <AnimalCard key={animal.id} animal={animal} />
            ))}
          </div>
        ) : (
          <EmptyState
            compact
            icon={PawPrint}
            title="No animals listed"
            subtitle="This shelter hasn't added any animals yet."
          />
        )}
      </Container>
    </VStack>
  );
}
