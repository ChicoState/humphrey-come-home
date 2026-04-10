/**
 * SearchResults — tabbed search results page with client-side filtering.
 * Reads location + filters from URL search params.
 * Route: /search?address=...&lat=...&lng=...
 */
import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Building2, FileSearch, PawPrint } from "lucide-react";
import AnimalCard from "@/components/ui/AnimalCard";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import Input from "@/components/ui/Input";
import PostCard from "@/components/ui/PostCard";
import Select from "@/components/ui/Select";
import ShelterCard from "@/components/ui/ShelterCard";
import Spinner from "@/components/ui/Spinner";
import { VStack, Text, Container } from "@/components/primitives";
import { useAnimals } from "@/hooks/queries/useAnimals";
import { usePosts } from "@/hooks/queries/usePosts";
import { useShelters } from "@/hooks/queries/useShelters";
import { compareDistanceThenNewest, formatDistance, haversineMiles } from "@/lib/location";
import { parseReportDescription } from "@/lib/reportDescription";
import styles from "./SearchResults.module.css";

const TABS = [
  { key: "shelters", label: "Shelters" },
  { key: "animals", label: "Animals" },
  { key: "posts", label: "Posts" },
];

const SPECIES_OPTIONS = [
  { value: "", label: "All species" },
  { value: "dog", label: "Dogs" },
  { value: "cat", label: "Cats" },
  { value: "bird", label: "Birds" },
  { value: "rabbit", label: "Rabbits" },
  { value: "other", label: "Other" },
];

const DISTANCE_OPTIONS = [
  { value: "10", label: "Within 10 miles" },
  { value: "25", label: "Within 25 miles" },
  { value: "50", label: "Within 50 miles" },
  { value: "100", label: "Within 100 miles" },
];

const ANIMAL_STATUS_OPTIONS = [
  { value: "available", label: "Available" },
  { value: "any", label: "Any status" },
  { value: "hold", label: "On hold" },
  { value: "adopted", label: "Adopted" },
  { value: "found", label: "Found" },
];

const POST_STATUS_OPTIONS = [
  { value: "open", label: "Lost + found" },
  { value: "lost", label: "Lost only" },
  { value: "found", label: "Found only" },
  { value: "reunited", label: "Reunited" },
  { value: "all", label: "All reports" },
];

function normalizeText(value) {
  return String(value || "").toLowerCase();
}

function matchesQuery(fields, query) {
  const needle = normalizeText(query).trim();
  if (!needle) return true;
  return fields.some((field) => normalizeText(field).includes(needle));
}

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const activeTab = searchParams.get("tab") || "shelters";
  const address = searchParams.get("address") || "";
  const lat = searchParams.get("lat") ? Number(searchParams.get("lat")) : null;
  const lng = searchParams.get("lng") ? Number(searchParams.get("lng")) : null;
  const query = searchParams.get("q") || "";
  const species = searchParams.get("species") || "";
  const distance = searchParams.get("distance") || "25";
  const animalStatus = searchParams.get("animalStatus") || "available";
  const postStatus = searchParams.get("postStatus") || "open";
  const hasCoordinates = lat != null && lng != null && !Number.isNaN(lat) && !Number.isNaN(lng);

  function updateParams(updates) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      Object.entries(updates).forEach(([key, value]) => {
        if (value == null || value === "") {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }
      });
      return next;
    }, { replace: true });
  }

  const { data: shelters = [], isFetching: sheltersLoading } = useShelters();
  const { data: animals = [], isFetching: animalsLoading } = useAnimals({
    status: animalStatus === "any" ? null : animalStatus,
  });
  const { data: posts = [], isFetching: postsLoading } = usePosts({
    status:
      postStatus === "all"
        ? null
        : postStatus === "open"
          ? ["lost", "found"]
          : postStatus,
  });

  const shelterById = useMemo(
    () => new Map(shelters.map((shelter) => [String(shelter.id), shelter])),
    [shelters],
  );

  const maxDistance = Number(distance);

  const filteredShelters = useMemo(() => {
    return shelters
      .map((shelter) => {
        const distanceMiles = hasCoordinates
          ? haversineMiles(lat, lng, shelter.latitude, shelter.longitude)
          : null;
        return {
          ...shelter,
          distanceMiles,
          distanceLabel: formatDistance(distanceMiles),
        };
      })
      .filter((shelter) => {
        if (hasCoordinates && shelter.distanceMiles == null) return false;
        if (hasCoordinates && shelter.distanceMiles > maxDistance) return false;
        return matchesQuery([shelter.name, shelter.address, shelter.phone], query);
      })
      .sort((a, b) => {
        if (a.distanceMiles != null || b.distanceMiles != null) {
          const aDistance = a.distanceMiles ?? Number.POSITIVE_INFINITY;
          const bDistance = b.distanceMiles ?? Number.POSITIVE_INFINITY;
          if (aDistance !== bDistance) return aDistance - bDistance;
        }
        return String(a.name || "").localeCompare(String(b.name || ""));
      });
  }, [shelters, hasCoordinates, lat, lng, maxDistance, query]);

  const filteredAnimals = useMemo(() => {
    return animals
      .map((animal) => {
        const shelter = shelterById.get(String(animal.shelter_id));
        const distanceMiles = hasCoordinates
          ? haversineMiles(lat, lng, shelter?.latitude, shelter?.longitude)
          : null;

        return {
          ...animal,
          shelter_name: shelter?.name,
          distanceMiles,
          distanceLabel: formatDistance(distanceMiles),
        };
      })
      .filter((animal) => {
        if (species && normalizeText(animal.species) !== species) return false;
        if (hasCoordinates && animal.distanceMiles == null) return false;
        if (hasCoordinates && animal.distanceMiles > maxDistance) return false;
        return matchesQuery(
          [
            animal.name,
            animal.species,
            animal.breed,
            animal.color,
            animal.description,
            animal.shelter_name,
          ],
          query,
        );
      })
      .sort(compareDistanceThenNewest);
  }, [animals, shelterById, hasCoordinates, lat, lng, maxDistance, species, query]);

  const filteredPosts = useMemo(() => {
    return posts
      .map((post) => {
        const parsed = parseReportDescription(post.description);
        const distanceMiles = hasCoordinates
          ? haversineMiles(lat, lng, post.latitude, post.longitude)
          : null;
        return {
          ...post,
          reportMeta: parsed.meta,
          cleanedDescription: parsed.notes,
          distanceMiles,
          distanceLabel: formatDistance(distanceMiles),
        };
      })
      .filter((post) => {
        if (species && normalizeText(post.reportMeta?.species) !== species) return false;
        if (hasCoordinates && post.distanceMiles == null) return false;
        if (hasCoordinates && post.distanceMiles > maxDistance) return false;
        return matchesQuery(
          [
            post.title,
            post.cleanedDescription,
            post.location_address,
            post.status,
            post.reportMeta?.species,
            post.reportMeta?.breed,
            post.reportMeta?.color,
          ],
          query,
        );
      })
      .sort(compareDistanceThenNewest);
  }, [posts, hasCoordinates, lat, lng, maxDistance, species, query]);

  const activeCount =
    activeTab === "shelters"
      ? filteredShelters.length
      : activeTab === "animals"
        ? filteredAnimals.length
        : filteredPosts.length;

  return (
    <VStack align="center" style={{ textAlign: "center" }}>
      <VStack gap={4} align="center" paddingX={6} style={{ marginBottom: 24 }}>
        <Badge variant="info">Live filters enabled</Badge>
        <Text variant="h1">Search Results</Text>
        {address ? (
          <Text variant="lg" color="muted" style={{ maxWidth: "44ch" }}>
            {hasCoordinates
              ? `Showing results within ${distance} miles of ${address}`
              : `Showing results near ${address}`}
          </Text>
        ) : (
          <Text variant="lg" color="muted" style={{ maxWidth: "44ch" }}>
            Browse shelters, animals, and community reports.
          </Text>
        )}
      </VStack>

      <Container size="lg" padding={0}>
        <div className={styles.filtersCard}>
          <div className={styles.filterGrid}>
            <Input
              label="Search"
              id="search-query"
              value={query}
              onChange={(e) => updateParams({ q: e.target.value })}
              placeholder="Breed, shelter name, markings..."
            />
            <Select
              label="Species"
              id="search-species"
              value={species}
              onChange={(e) => updateParams({ species: e.target.value })}
              options={SPECIES_OPTIONS}
            />
            <Select
              label="Distance"
              id="search-distance"
              value={distance}
              onChange={(e) => updateParams({ distance: e.target.value })}
              options={DISTANCE_OPTIONS}
              disabled={!hasCoordinates}
            />
            {activeTab === "animals" ? (
              <Select
                label="Animal status"
                id="search-animal-status"
                value={animalStatus}
                onChange={(e) => updateParams({ animalStatus: e.target.value })}
                options={ANIMAL_STATUS_OPTIONS}
              />
            ) : activeTab === "posts" ? (
              <Select
                label="Report type"
                id="search-post-status"
                value={postStatus}
                onChange={(e) => updateParams({ postStatus: e.target.value })}
                options={POST_STATUS_OPTIONS}
              />
            ) : (
              <div className={styles.summaryPanel}>
                <Text variant="label" color="muted">Filtered results</Text>
                <Text variant="subtitle">{activeCount}</Text>
                <Text variant="sm" color="muted">
                  {hasCoordinates ? `Inside ${distance} miles` : "All visible shelters"}
                </Text>
              </div>
            )}
          </div>

          <div className={styles.resultSummary}>
            <Text variant="sm" color="muted">
              {activeCount} {activeTab} match your filters
            </Text>
            {!hasCoordinates && (
              <Text variant="xs" color="light">
                Add a precise location from the home screen to unlock distance filtering.
              </Text>
            )}
          </div>
        </div>

        <div className={styles.tabs}>
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ""}`}
              onClick={() => updateParams({ tab: tab.key })}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "shelters" && (
          <div className={styles.tabContent}>
            {sheltersLoading ? (
              <div className={styles.loading}><Spinner size="lg" /></div>
            ) : filteredShelters.length > 0 ? (
              <div className={styles.shelterGrid}>
                {filteredShelters.map((shelter) => (
                  <ShelterCard key={shelter.id} shelter={shelter} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Building2}
                title="No shelters found"
                subtitle="Try changing the search term, species, or distance range."
              />
            )}
          </div>
        )}

        {activeTab === "animals" && (
          <div className={styles.tabContent}>
            {animalsLoading ? (
              <div className={styles.loading}><Spinner size="lg" /></div>
            ) : filteredAnimals.length > 0 ? (
              <div className={styles.animalGrid}>
                {filteredAnimals.map((animal) => (
                  <AnimalCard key={animal.id} animal={animal} showShelter />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={PawPrint}
                title="No animals found"
                subtitle="Try widening the distance or removing one of the filters."
              />
            )}
          </div>
        )}

        {activeTab === "posts" && (
          <div className={styles.tabContent}>
            {postsLoading ? (
              <div className={styles.loading}><Spinner size="lg" /></div>
            ) : filteredPosts.length > 0 ? (
              <VStack gap={3}>
                {filteredPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </VStack>
            ) : (
              <EmptyState
                icon={FileSearch}
                title="No lost or found reports"
                subtitle="Try a wider search area or be the first to create a nearby report."
                button={{ onPress: () => navigate("/lost"), label: "Report Lost Pet" }}
              />
            )}
          </div>
        )}
      </Container>
    </VStack>
  );
}
