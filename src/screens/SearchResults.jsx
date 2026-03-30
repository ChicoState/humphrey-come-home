/**
 * SearchResults — tabbed search results page (Shelters, Animals, Posts).
 * Reads location from URL search params (address, lat, lng).
 * Each tab shows relevant results with links to detail pages.
 * Route: /search?address=...&lat=...&lng=...
 */
import { useSearchParams, useNavigate } from "react-router";
import { MapPin, Calendar, Building2, PawPrint, FileSearch } from "lucide-react";
import AnimalCard from "@/components/ui/AnimalCard";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import ShelterCard from "@/components/ui/ShelterCard";
import Spinner from "@/components/ui/Spinner";
import { VStack, HStack, Text, Container } from "@/components/primitives";
import { useShelters } from "@/hooks/queries/useShelters";
import { useAnimals } from "@/hooks/queries/useAnimals";
import { usePosts } from "@/hooks/queries/usePosts";
import formatDate from "@/lib/formatDate";
import styles from "./SearchResults.module.css";

const TABS = [
  { key: "shelters", label: "Shelters" },
  { key: "animals", label: "Animals" },
  { key: "posts", label: "Posts" },
];

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeTab = searchParams.get("tab") || "shelters";
  const setActiveTab = (tab) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("tab", tab);
      return next;
    }, { replace: true });
  };

  const address = searchParams.get("address") || "";
  const lat = searchParams.get("lat") ? Number(searchParams.get("lat")) : null;
  const lng = searchParams.get("lng") ? Number(searchParams.get("lng")) : null;

  const locationFilter = { address, lat, lng };

  const {
    data: shelters,
    isFetching: sheltersLoading,
  } = useShelters(locationFilter);

  const {
    data: animals,
    isFetching: animalsLoading,
  } = useAnimals(locationFilter);

  const {
    data: posts,
    isFetching: postsLoading,
  } = usePosts({ ...locationFilter, status: ["lost", "found"] });

  return (
    <VStack align="center" style={{ textAlign: 'center' }}>
      <VStack gap={4} align="center" paddingX={6} style={{ marginBottom: 24 }}>
        <Badge variant="warning">Location filtering coming soon</Badge>
        <Text variant="h1">Search Results</Text>
        {address && (
          <Text variant="lg" color="muted" style={{ maxWidth: '44ch' }}>
            Near {address}
          </Text>
        )}
      </VStack>

      <Container size="lg" padding={0}>
      {/* Tabs */}
      <div className={styles.tabs}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Shelters Tab */}
      {activeTab === "shelters" && (
        <div className={styles.tabContent}>
          {sheltersLoading ? (
            <div className={styles.loading}><Spinner size="lg" /></div>
          ) : shelters?.length > 0 ? (
            <div className={styles.shelterGrid}>
              {shelters.map((shelter) => (
                <ShelterCard key={shelter.id} shelter={shelter} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Building2}
              title="No shelters found"
              subtitle="Try expanding your search radius or check a nearby city."
            />
          )}
        </div>
      )}

      {/* Animals Tab */}
      {activeTab === "animals" && (
        <div className={styles.tabContent}>
          {animalsLoading ? (
            <div className={styles.loading}><Spinner size="lg" /></div>
          ) : animals?.length > 0 ? (
            <div className={styles.animalGrid}>
              {animals.map((animal) => (
                <AnimalCard key={animal.id} animal={animal} showShelter />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={PawPrint}
              title="No animals found"
              subtitle="Check back later or try a different location."
            />
          )}
        </div>
      )}

      {/* Posts Tab */}
      {activeTab === "posts" && (
        <div className={styles.tabContent}>
          {postsLoading ? (
            <div className={styles.loading}><Spinner size="lg" /></div>
          ) : posts?.length > 0 ? (
            <div className={styles.list}>
              {posts.map((post) => (
                <Card key={post.id} onClick={() => navigate(`/posts/${post.id}`)}>
                  <VStack gap={2}>
                    <HStack gap={2} align="center">
                      <Badge variant={{ lost: 'error', found: 'warning', reunited: 'success' }[post.status]}>
                        {post.status}
                      </Badge>
                      <Text variant="h3">{post.title}</Text>
                    </HStack>
                    <HStack gap={3} wrap>
                      {post.location_address && (
                        <HStack gap={1} align="center">
                          <MapPin size={14} />
                          <Text variant="sm" color="muted">{post.location_address}</Text>
                        </HStack>
                      )}
                      {post.created_at && (
                        <HStack gap={1} align="center">
                          <Calendar size={14} />
                          <Text variant="sm" color="muted">{formatDate(post.created_at)}</Text>
                        </HStack>
                      )}
                    </HStack>
                  </VStack>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={FileSearch}
              title="No lost or found reports"
              subtitle="Be the first to report a lost or found pet nearby."
            />
          )}
        </div>
      )}
      </Container>
    </VStack>
  );
}
