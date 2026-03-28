/**
 * Landing — homepage / marketing screen.
 * Hero with location search, CTAs for "Report Lost" and "Report Found",
 * a polaroid photo gallery, and a bottom call-to-action section.
 * No props — standalone route at "/".
 */
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, PawPrint, Heart } from 'lucide-react';
import { VStack, HStack, Text, Container, Divider, ScrollRail } from '@/components/primitives';
import Button from '@/components/ui/Button';
import PolaroidRail from '@/components/ui/PolaroidRail';
import DashedBox from '@/components/ui/DashedBox';
import Image from '@/components/ui/Image';
import LocationInput from '@/components/forms/LocationInput';
import styles from './Landing.module.css';

const recentAreas = [
  { label: 'Chico', address: 'Chico, CA, USA', lat: 39.7285, lng: -121.8375 },
  { label: 'Sacramento', address: 'Sacramento, CA, USA', lat: 38.5816, lng: -121.4944 },
  { label: 'San Francisco', address: 'San Francisco, CA, USA', lat: 37.7749, lng: -122.4194 },
  { label: 'Paradise', address: 'Paradise, CA, USA', lat: 39.7596, lng: -121.6219 },
  { label: 'Redding', address: 'Redding, CA, USA', lat: 40.5865, lng: -122.3917 },
  { label: 'Oroville', address: 'Oroville, CA, USA', lat: 39.5139, lng: -121.5578 },
  { label: 'Davis', address: 'Davis, CA, USA', lat: 38.5449, lng: -121.7405 },
  { label: 'Yuba City', address: 'Yuba City, CA, USA', lat: 39.1370, lng: -121.6078 },
];

export default function Landing() {
  const navigate = useNavigate();
  const [location, setLocation] = useState({ address: '', lat: null, lng: null });

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
    <VStack align="center" style={{ textAlign: 'center' }}>
      {/* ── Hero ────────────────────────────────────────── */}
      <VStack gap={4} align="center" paddingX={6} style={{ marginBottom: 24 }}>
        <Image
          src="/hero.jpg"
          alt="Humphrey Come Home"
          width={1680}
          height={697}
          priority
          style={{ maxWidth: 'min(440px, 100%)', height: 'auto' }}
        />
        <Text variant="h1">Find Lost Pets Faster</Text>
        <Text variant="lg" color="muted" style={{ maxWidth: '44ch' }}>
          Humphrey Come Home helps families reunite with missing pets by making it easy to search nearby shelters, report found animals, and act fast.
        </Text>
      </VStack>

      {/* ── Search ──────────────────────────────────────── */}
      <Container size="md" className={styles.stickySearch}>
        <LocationInput
          value={location}
          onChange={setLocation}
          onSubmit={handleSearch}
          onCameraAction={() => navigate('/image-search')}
          placeholder="Search by address, city, or ZIP code"
          dropDown
        />
      </Container>

      {/* ── Recently searched areas ─────────────────────── */}
      <div style={{ width: '100%', maxWidth: 700, margin: '16px auto 0' }}>
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

      {/* ── CTA ─────────────────────────────────────────── */}
      <Container size="md" style={{ paddingTop: 32, paddingBottom: 16 }}>
        <Divider label="or" />
        <HStack gap={3} justify="center" wrap style={{ marginTop: 24 }}>
          <Button variant="primary" size="lg" icon={Search} onClick={() => navigate('/lost')}>
            Report Lost
          </Button>
          <Button variant="primary" size="lg" icon={PawPrint} onClick={() => navigate('/found')}>
            Report Found
          </Button>
        </HStack>
      </Container>

      {/* ── Polaroid gallery ─────────────────────────────── */}
      <div style={{ width: '100%', marginTop: 16 }}>
        <PolaroidRail reverse photos={[
          { id: 'demo-1', src: '/gallery/1.webp', label: 'Buddy' },
          { id: 'demo-2', src: '/gallery/2.webp', label: 'Whiskers' },
          { id: 'demo-3', src: '/gallery/3.webp', label: 'Luna' },
          { id: 'demo-4', src: '/gallery/4.webp', label: 'Max' },
          { id: 'demo-5', src: '/gallery/5.webp', label: 'Bella' },
          { id: 'demo-6', src: '/gallery/6.webp', label: 'Charlie' },
          { id: 'demo-7', src: '/gallery/7.webp', label: 'Daisy' },
          { id: 'demo-8', src: '/gallery/8.webp', label: 'Rocky' },
          { id: 'demo-9', src: '/gallery/9.webp', label: 'Milo' },
          { id: 'demo-10', src: '/gallery/10.webp', label: 'Cleo' },
        ]} />
      </div>

      {/* ── WIP section placeholder ──────────────────────── */}
      <Container size="md" style={{ padding: '48px 16px', textAlign: 'center' }}>
        <DashedBox dash={14} gap={8} strokeWidth={3} radius={16} style={{ padding: '40px 24px' }}>
          <Text variant="h2" color="muted" style={{ fontSize: '1.1rem' }}>Future Content Area</Text>
          <Text variant="body" color="light" style={{ maxWidth: '48ch', margin: '8px auto 0', lineHeight: 1.5 }}>
            Ideas: success stories / reunited pets, how-it-works steps, shelter partner logos, community stats (pets reunited, shelters connected), or a live feed of recent reports.
          </Text>
        </DashedBox>
      </Container>

      {/* ── Bottom CTA card ───────────────────────────────── */}
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
        <Text variant="h2" style={{ fontSize: '1.35rem', color: 'var(--color-primary-900)' }}>
          Every minute counts
        </Text>
        <Text variant="body" style={{ maxWidth: '38ch', lineHeight: 1.5, color: 'var(--color-primary-800)' }}>
          The sooner a lost pet is reported, the higher the chance of a reunion. Help spread the word in your community.
        </Text>
        <HStack gap={3} wrap justify="center" style={{ marginTop: 4 }}>
          <Button variant="primary" size="md" icon={Search} onClick={() => navigate('/lost')}>
            Report Lost
          </Button>
          <Button variant="primary" size="md" icon={PawPrint} onClick={() => navigate('/found')}>
            Report Found
          </Button>
        </HStack>
      </div>
      </Container>
    </VStack>
  );
}
