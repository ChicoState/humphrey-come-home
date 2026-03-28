/**
 * SearchResults — tabbed search results page (Shelters, Animals, Posts).
 * Reads location from URL search params (address, lat, lng).
 * Each tab shows relevant results with links to detail pages.
 * Route: /search?address=...&lat=...&lng=...
 */
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { MapPin, Phone, Calendar, Building2, PawPrint, FileSearch } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import Spinner from "@/components/ui/Spinner";
import { VStack, Text, Container } from "@/components/primitives";
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
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("shelters");

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

      <Container size="md">
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
            <div className={styles.list}>
              {shelters.map((shelter) => (
                <Card
                  key={shelter.id}
                  className={styles.shelterCard}
                >
                  <Text variant="h3">{shelter.name}</Text>
                  {shelter.address && (
                    <Text variant="sm" color="muted" as="p" className={styles.shelterDetail}>
                      <MapPin size={14} /> {shelter.address}
                    </Text>
                  )}
                  {shelter.phone && (
                    <Text variant="sm" color="muted" as="p" className={styles.shelterDetail}>
                      <Phone size={14} /> {shelter.phone}
                    </Text>
                  )}
                </Card>
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
                <Card
                  key={animal.id}
                  onClick={() => navigate(`/animals/${animal.id}`)}
                  className={styles.animalCard}
                >
                  {animal.photo_url && (
                    <img
                      src={animal.photo_url}
                      alt={animal.name}
                      className={styles.animalPhoto}
                    />
                  )}
                  <div className={styles.animalInfo}>
                    <Text variant="h3">{animal.name}</Text>
                    <Text variant="sm" color="muted">
                      {[animal.species, animal.breed].filter(Boolean).join(" - ")}
                    </Text>
                    {animal.shelter_name && (
                      <Text variant="xs" color="light">{animal.shelter_name}</Text>
                    )}
                  </div>
                </Card>
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
                <Card
                  key={post.id}
                  onClick={() => navigate(`/posts/${post.id}`)}
                  className={styles.postCard}
                >
                  <div className={styles.postHeader}>
                    <span
                      className={`${styles.badge} ${
                        post.status === "lost"
                          ? styles.badgeLost
                          : post.status === "found"
                          ? styles.badgeFound
                          : styles.badgeReunited
                      }`}
                    >
                      {post.status}
                    </span>
                    <Text variant="h3">{post.title}</Text>
                  </div>
                  <div className={styles.postDetails}>
                    {post.location_address && (
                      <Text variant="sm" color="muted" as="span" className={styles.postDetail}>
                        <MapPin size={14} /> {post.location_address}
                      </Text>
                    )}
                    {post.created_at && (
                      <Text variant="sm" color="muted" as="span" className={styles.postDetail}>
                        <Calendar size={14} /> {formatDate(post.created_at)}
                      </Text>
                    )}
                  </div>
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
