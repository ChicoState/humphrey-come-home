/**
 * Settings — user account settings screen.
 * Allows editing display name and home location.
 * Email notifications section is disabled (coming soon).
 * Auth + profile loading handled by Layout. Route: /settings
 */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { LogOut, Check } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import SuggestionList from "@/components/ui/SuggestionList";
import usePlacesAutocomplete from "@/hooks/usePlacesAutocomplete";
import { VStack, HStack, Text, Container } from "@/components/primitives";
import { useAuth } from "@/hooks/useAuth";
import { useProfile, useUpdateProfile } from "@/hooks/queries/useProfile";
import styles from "./Settings.module.css";

export default function Settings() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { data: profile } = useProfile(user?.id);
  const updateProfile = useUpdateProfile();

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setLocation(profile.home_location || "");
    }
  }, [profile]);

  const places = usePlacesAutocomplete();
  const profileName = profile?.name || "";
  const profileLocation = profile?.home_location || "";
  const hasChanges = name.trim() !== profileName || location.trim() !== profileLocation;

  async function handleSaveProfile(e) {
    e.preventDefault();
    try {
      await updateProfile.mutateAsync({
        id: user.id,
        name: name.trim(),
        home_location: location.trim(),
      });
    } catch {
      // Error surfaced via updateProfile.isError
    }
  }

  async function handleSignOut() {
    await signOut();
    navigate("/");
  }

  return (
    <VStack>
      <Text variant="h1" align="center" style={{ marginBottom: 32 }}>Settings</Text>

      <Container size="md">
      {/* Profile */}
      <section className={styles.row}>
        <VStack gap={1}>
          <Text variant="h3">Profile</Text>
          <Text variant="sm" color="muted">Your public display info.</Text>
        </VStack>
        <div className={styles.rowContent}>
          <VStack gap={4} as="form" onSubmit={handleSaveProfile} style={{ textAlign: 'left' }}>
            <Input
              label="Display Name"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
            <div style={{ position: 'relative' }}>
              <Input
                label="Home Location"
                id="location"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  if (places.ready) places.fetchSuggestions(e.target.value);
                }}
                onBlur={() => places.clearSuggestions()}
                placeholder="City, State"
                autoComplete="off"
              />
              <SuggestionList
                suggestions={places.suggestions}
                onSelect={async (prediction) => {
                  const result = await places.selectSuggestion(prediction);
                  setLocation(result.address);
                }}
                position="below"
              />
            </div>
            <HStack>
              <Button
                variant="primary"
                size="sm"
                icon={Check}
                type="submit"
                loading={updateProfile.isPending}
                disabled={!hasChanges}
              >
                {updateProfile.isSuccess && !hasChanges ? "Saved" : "Save"}
              </Button>
            </HStack>
          </VStack>
        </div>
      </section>

      {/* Notifications */}
      <section className={styles.row}>
        <VStack gap={1}>
          <div><Badge variant="warning">Coming soon</Badge></div>
          <Text variant="h3">Notifications</Text>
          <Text variant="sm" color="muted">Email alerts for nearby activity.</Text>
        </VStack>
        <div className={styles.rowContent}>
          <VStack>
            <label className={styles.toggleRow}>
              <div>
                <Text variant="body" weight="500">Lost pet alerts</Text>
                <Text variant="sm" color="muted">Get notified when a pet is reported lost near you</Text>
              </div>
              <input type="checkbox" className={styles.toggle} disabled />
            </label>
            <label className={styles.toggleRow}>
              <div>
                <Text variant="body" weight="500">Found pet alerts</Text>
                <Text variant="sm" color="muted">Get notified when a pet is found near you</Text>
              </div>
              <input type="checkbox" className={styles.toggle} disabled />
            </label>
            <label className={styles.toggleRow}>
              <div>
                <Text variant="body" weight="500">Product updates</Text>
                <Text variant="sm" color="muted">News and feature announcements</Text>
              </div>
              <input type="checkbox" className={styles.toggle} disabled />
            </label>
          </VStack>
        </div>
      </section>

      {/* Account */}
      <section className={styles.row}>
        <VStack gap={1}>
          <Text variant="h3">Account</Text>
          <Text variant="sm" color="muted">Sign out of your account.</Text>
        </VStack>
        <div className={styles.rowContent}>
          <div>
            <Button variant="danger" size="sm" icon={LogOut} onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </section>
      </Container>
    </VStack>
  );
}
