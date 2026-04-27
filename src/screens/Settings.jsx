/**
 * Settings — user account settings screen.
 * Allows editing display name, avatar, and home location.
 * Email notifications section is still a placeholder.
 * Route: /settings
 */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Check, LogOut } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Spinner from "@/components/ui/Spinner";
import SuggestionList from "@/components/ui/SuggestionList";
import ImageUpload from "@/components/forms/ImageUpload";
import usePlacesAutocomplete from "@/hooks/usePlacesAutocomplete";
import { VStack, HStack, Text, Container } from "@/components/primitives";
import { useAuth } from "@/hooks/useAuth";
import { useProfile, useUpdateProfile } from "@/hooks/queries/useProfile";
import { uploadPublicImage } from "@/lib/storage";
import styles from "./Settings.module.css";

export default function Settings() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile(user?.id);
  const updateProfile = useUpdateProfile();

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarRemoved, setAvatarRemoved] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setLocation(profile.home_location || "");
      setAvatarRemoved(false);
      setAvatarFile(null);
    }
  }, [profile]);

  const places = usePlacesAutocomplete();
  const profileName = profile?.name || "";
  const profileLocation = profile?.home_location || "";
  const currentAvatarUrl = profile?.avatar_url || null;
  const nextAvatarValue = avatarRemoved ? null : avatarFile || currentAvatarUrl;
  const hasChanges =
    name.trim() !== profileName ||
    location.trim() !== profileLocation ||
    !!avatarFile ||
    (avatarRemoved && !!currentAvatarUrl);

  async function handleSaveProfile(e) {
    e.preventDefault();
    try {
      let avatarUrl = avatarRemoved ? null : currentAvatarUrl;

      if (avatarFile) {
        const upload = await uploadPublicImage({
          bucket: "avatars",
          file: avatarFile,
          userId: user.id,
        });
        avatarUrl = upload?.publicUrl || null;
      }

      await updateProfile.mutateAsync({
        id: user.id,
        name: name.trim(),
        home_location: location.trim(),
        avatar_url: avatarUrl,
      });

      setAvatarFile(null);
      setAvatarRemoved(false);
    } catch {
      // Error surfaced via updateProfile.isError
    }
  }

  async function handleSignOut() {
    await signOut();
    navigate("/");
  }

  if (profileLoading) {
    return <div className={styles.loading}><Spinner size="lg" /></div>;
  }

  return (
    <VStack>
      <Text variant="h1" align="center" style={{ marginBottom: 32 }}>Settings</Text>

      <Container size="md">
        <section className={styles.row}>
          <VStack gap={1}>
            <Text variant="h3">Profile</Text>
            <Text variant="sm" color="muted">Your public display info.</Text>
          </VStack>
          <div className={styles.rowContent}>
            <VStack gap={4} as="form" onSubmit={handleSaveProfile} style={{ textAlign: "left" }}>
              <div className={styles.avatarEditor}>
                <Text variant="sm" color="muted">Profile photo</Text>
                <ImageUpload
                  value={nextAvatarValue}
                  onChange={(file) => {
                    setAvatarFile(file);
                    setAvatarRemoved(false);
                  }}
                  onClear={() => {
                    setAvatarFile(null);
                    setAvatarRemoved(true);
                  }}
                />
              </div>

              <Input
                label="Display Name"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
              <div style={{ position: "relative" }}>
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
              <HStack gap={3} wrap>
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
                {updateProfile.isSuccess && !hasChanges && (
                  <Text variant="sm" color="success" style={{ alignSelf: "center" }}>
                    Profile updated.
                  </Text>
                )}
              </HStack>
            </VStack>
          </div>
        </section>

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
