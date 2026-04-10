import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Heart, PawPrint, Search, BellRing, MapPinned } from "lucide-react";
import { VStack, HStack, Text, Container, Divider, ScrollRail } from "@/components/primitives";
import { useAnimals } from "@/hooks/queries/useAnimals";
import { usePosts } from "@/hooks/queries/usePosts";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import AnimalCard from "@/components/ui/AnimalCard";
import PostCard from "@/components/ui/PostCard";
import PolaroidRail from "@/components/ui/PolaroidRail";
import Image from "@/components/ui/Image";
import Spinner from "@/components/ui/Spinner";
import LocationInput from "@/components/forms/LocationInput";
import styles from "./Landing.module.css";

const recentAreas = [
  { label: "Chico", address: "Chico, CA, USA", lat: 39.7285, lng: -121.8375 },
  { label: "Sacramento", address: "Sacramento, CA, USA", lat: 38.5816, lng: -121.4944 },
  { label: "San Francisco", address: "San Francisco, CA, USA", lat: 37.7749, lng: -122.4194 },
  { label: "Paradise", address: "Paradise, CA, USA", lat: 39.7596, lng: -121.6219 },
  { label: "Redding", address: "Redding, CA, USA", lat: 40.5865, lng: -122.3917 },
  { label: "Oroville", address: "Oroville, CA, USA", lat: 39.5139, lng: -121.5578 },
  { label: "Davis", address: "Davis, CA, USA", lat: 38.5449, lng: -121.7405 },
  { label: "Yuba City", address: "Yuba City, CA, USA", lat: 39.1370, lng: -121.6078 },
];

const HOW_IT_WORKS = [
  {
    title: "Search nearby shelters",
    body: "Start with a city, ZIP code, or your current location to browse animals, shelter listings, and local reports.",
    icon: MapPinned,
  },
  {
    title: "Publish a clear report",
    body: "Share a photo, last seen location, and identifying details so people can recognize the pet quickly.",
    icon: Search,
  },
  {
    title: "Stay ready to reconnect",
    body: "Watch new community reports and shelter activity so you can act fast when a match appears.",
    icon: BellRing,
  },
];

export default function Landing() {
  const navigate = useNavigate();
  const [location, setLocation] = useState({ address: "", lat: null, lng: null });
  const { data: animals = [], isFetching: animalsLoading } = useAnimals({ status: "available" });
  const { data: posts = [], isFetching: postsLoading } = usePosts({ status: ["lost", "found"] });

  const featuredAnimals = useMemo(() => animals.slice(0, 4), [animals]);
  const recentPosts = useMemo(() => posts.slice(0, 3), [posts]);

  function handleSearch() {
    if (!location.address) return;
    const params = new URLSearchParams({
      address: location.address,
      ...(location.lat != null && { lat: location.lat }),
      ...(location.lng != null && { lng: location.lng }),
    });
    navigate(`/search?${params.toString()}`);
  }

  return (
    <VStack align="center" style={{ textAlign: "center" }}>
      <VStack gap={4} align="center" paddingX={6} style={{ marginBottom: 24 }}>
        <Image
          src="/hero.jpg"
          alt="Humphrey Come Home"
          width={1680}
          height={697}
          priority
          style={{ maxWidth: "min(440px, 100%)", height: "auto" }}
        />
        <Text variant="h1">Find Lost Pets Faster</Text>
        <Text variant="lg" color="muted" style={{ maxWidth: "44ch" }}>
          Humphrey Come Home helps families reunite with missing pets by making it easy to search nearby shelters, report found animals, and act fast.
        </Text>
      </VStack>

      <Container size="md" className={styles.stickySearch}>
        <LocationInput
          value={location}
          onChange={setLocation}
          onSubmit={handleSearch}
          onCameraAction={() => navigate("/image-search")}
          placeholder="Search by address, city, or ZIP code"
          dropDown
        />
      </Container>

      <div style={{ width: "100%", maxWidth: 700, margin: "16px auto 0" }}>
        <ScrollRail gap={3} animated>
          {recentAreas.map((city) => (
            <Button
              key={city.label}
              variant="outline"
              size="sm"
              onClick={() => {
                navigate(`/search?address=${encodeURIComponent(city.address)}&lat=${city.lat}&lng=${city.lng}`);
              }}
            >
              {city.label}
            </Button>
          ))}
        </ScrollRail>
      </div>

      <Container size="md" style={{ paddingTop: 32, paddingBottom: 16 }}>
        <Divider label="or" />
        <HStack gap={3} justify="center" wrap style={{ marginTop: 24 }}>
          <Button variant="primary" size="lg" icon={Search} onClick={() => navigate("/lost")}>
            Report Lost
          </Button>
          <Button variant="primary" size="lg" icon={PawPrint} onClick={() => navigate("/found")}>
            Report Found
          </Button>
        </HStack>
      </Container>

      <div style={{ width: "100%", marginTop: 16 }}>
        <PolaroidRail
          reverse
          photos={animals.slice(0, 10).map((animal) => ({
            id: animal.id,
            src: animal.photo_url,
            label: animal.name,
          }))}
        />
      </div>

      <Container size="lg" className={styles.liveSection}>
        <div className={styles.sectionHeader}>
          <div>
            <Text variant="subtitle">How Humphrey helps</Text>
            <Text variant="body" color="muted" style={{ marginTop: 8 }}>
              The app now supports live shelter search, community report browsing, and guided lost/found reporting flows.
            </Text>
          </div>
          <Badge variant="success">Live data</Badge>
        </div>

        <div className={styles.howItWorksGrid}>
          {HOW_IT_WORKS.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className={styles.infoCard}>
                <Icon size={22} className={styles.infoIcon} />
                <Text variant="h3">{item.title}</Text>
                <Text variant="sm" color="muted">{item.body}</Text>
              </div>
            );
          })}
        </div>
      </Container>

      <Container size="lg" className={styles.feedSection}>
        <div className={styles.feedGrid}>
          <section className={styles.feedColumn}>
            <div className={styles.feedHeader}>
              <div>
                <Text variant="subtitle">Recent community reports</Text>
                <Text variant="sm" color="muted">Real lost and found posts from the app.</Text>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate("/search?tab=posts")}>View all</Button>
            </div>

            {postsLoading ? (
              <div className={styles.loadingBlock}><Spinner size="lg" /></div>
            ) : recentPosts.length > 0 ? (
              <VStack gap={3}>
                {recentPosts.map((post) => (
                  <PostCard key={post.id} post={post} compact />
                ))}
              </VStack>
            ) : (
              <div className={styles.emptyCard}>
                <Text variant="h3">No reports yet</Text>
                <Text variant="sm" color="muted">The first lost or found report will show up here automatically.</Text>
              </div>
            )}
          </section>

          <section className={styles.feedColumn}>
            <div className={styles.feedHeader}>
              <div>
                <Text variant="subtitle">Animals you can search now</Text>
                <Text variant="sm" color="muted">Pulled from shelter listings that already exist in the database.</Text>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate("/search?tab=animals")}>Browse animals</Button>
            </div>

            {animalsLoading ? (
              <div className={styles.loadingBlock}><Spinner size="lg" /></div>
            ) : featuredAnimals.length > 0 ? (
              <div className={styles.animalGrid}>
                {featuredAnimals.map((animal) => (
                  <AnimalCard key={animal.id} animal={animal} />
                ))}
              </div>
            ) : (
              <div className={styles.emptyCard}>
                <Text variant="h3">No animals available yet</Text>
                <Text variant="sm" color="muted">Once shelter records are synced, this section will update automatically.</Text>
              </div>
            )}
          </section>
        </div>
      </Container>

      <Container size="md">
        <div className={styles.ctaPetsWrap}>
          <Image
            src="/pets-peeking.png"
            alt="Cute pets peeking"
            className={styles.ctaPets}
          />
        </div>
        <div className={styles.ctaCard}>
          <Heart size={32} strokeWidth={2.2} className={styles.ctaIcon} />
          <Text variant="subtitle" color="primary">
            Every minute counts
          </Text>
          <Text variant="body" color="primary" style={{ maxWidth: "38ch" }}>
            The sooner a lost pet is reported, the higher the chance of a reunion. Help spread the word in your community.
          </Text>
          <HStack gap={3} wrap justify="center" style={{ marginTop: 4 }}>
            <Button variant="primary" size="md" icon={Search} onClick={() => navigate("/lost")}>
              Report Lost
            </Button>
            <Button variant="primary" size="md" icon={PawPrint} onClick={() => navigate("/found")}>
              Report Found
            </Button>
          </HStack>
        </div>
      </Container>
    </VStack>
  );
}
