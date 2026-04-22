/**
 * ReportPetForm — shared form for lost/found pet reports.
 * Persists drafts locally, uploads an optional image, and creates a post.
 */
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { AlertCircle, CheckCircle2, Clock3, LogIn, MapPin, Search, ShieldCheck } from "lucide-react";
import ImageUpload from "@/components/forms/ImageUpload";
import LocationInput from "@/components/forms/LocationInput";
import { Container, Divider, HStack, Text, VStack } from "@/components/primitives";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { useAuth } from "@/hooks/useAuth";
import { useCreatePost } from "@/hooks/queries/usePosts";
import { buildReportDescription, buildReportTitle } from "@/lib/reportDescription";
import { uploadPublicImage } from "@/lib/storage";
import styles from "./ReportPetForm.module.css";
import { supabase } from "@/lib/supabase";

const SPECIES_OPTIONS = [
  { value: "", label: "Select species" },
  { value: "dog", label: "Dog" },
  { value: "cat", label: "Cat" },
  { value: "bird", label: "Bird" },
  { value: "rabbit", label: "Rabbit" },
  { value: "other", label: "Other" },
];

const GENDER_OPTIONS = [
  { value: "", label: "Unknown / not sure" },
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
];

const SIZE_OPTIONS = [
  { value: "", label: "Unknown / not sure" },
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
  { value: "x-large", label: "Extra large" },
];

const MICROCHIP_OPTIONS = [
  { value: "", label: "Unknown / not sure" },
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

const MODE_COPY = {
  lost: {
    badge: "Lost pet report",
    title: "Report a Lost Pet",
    subtitle: "Create a clear, searchable report so nearby shelters and community members can help spot your pet fast.",
    locationLabel: "Last seen location",
    locationPlaceholder: "Search where your pet was last seen",
    eventLabel: "Last seen date and time",
    notesPlaceholder: "Add details that would help someone recognize your pet, where they disappeared, temperament, collar info, and anything else people should know.",
    submitLabel: "Publish Lost Pet Report",
  },
  found: {
    badge: "Found pet report",
    title: "Report a Found Pet",
    subtitle: "Share where and when you found the pet so the owner has a better chance of reconnecting quickly.",
    locationLabel: "Location found",
    locationPlaceholder: "Search where the pet was found",
    eventLabel: "Found date and time",
    notesPlaceholder: "Describe the pet, condition, collar, behavior, and any steps you have already taken such as checking a microchip or contacting a shelter.",
    submitLabel: "Publish Found Pet Report",
  },
};

function getDraftKey(mode) {
  return `hch-report-draft-${mode}`;
}

function createInitialForm(contactEmail = "") {
  return {
    petName: "",
    species: "",
    breed: "",
    age: "",
    gender: "",
    size: "",
    color: "",
    microchip: "",
    eventAt: "",
    location: { address: "", lat: null, lng: null },
    notes: "",
    contactName: "",
    contactPhone: "",
    contactEmail,
  };
}

function safeParseDraft(rawValue, fallbackEmail = "") {
  if (!rawValue) return createInitialForm(fallbackEmail);

  try {
    const parsed = JSON.parse(rawValue);
    return {
      ...createInitialForm(fallbackEmail),
      ...parsed,
      location: {
        address: parsed?.location?.address || "",
        lat: parsed?.location?.lat ?? null,
        lng: parsed?.location?.lng ?? null,
      },
      contactEmail: parsed?.contactEmail || fallbackEmail,
    };
  } catch {
    return createInitialForm(fallbackEmail);
  }
}

function isValidEmail(value) {
  return /^\S+@\S+\.\S+$/.test(value);
}

export default function ReportPetForm({ mode = "lost" }) {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const createPost = useCreatePost();
  const copy = MODE_COPY[mode] || MODE_COPY.lost;
  const draftKey = useMemo(() => getDraftKey(mode), [mode]);

  const [form, setForm] = useState(createInitialForm());
  const [imageFile, setImageFile] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [hydrated, setHydrated] = useState(false);
  

  useEffect(() => {
    const nextForm = safeParseDraft(
      window.localStorage.getItem(draftKey),
      user?.email || "",
    );
    setForm(nextForm);
    setHydrated(true);
    setImageFile(null);
  }, [draftKey, user?.email]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(draftKey, JSON.stringify(form));
  }, [draftKey, form, hydrated]);

  useEffect(() => {
    if (!user?.email) return;
    setForm((prev) => (prev.contactEmail ? prev : { ...prev, contactEmail: user.email }));
  }, [user?.email]);

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }

  function validate() {
    const nextErrors = {};

    if (!form.petName.trim() && !form.species) {
      nextErrors.petName = "Add a pet name or choose a species.";
    }
    if (!form.location.address.trim()) {
      nextErrors.location = "Choose the location from suggestions or use Near Me.";
    }
    if (!form.eventAt) {
      nextErrors.eventAt = "Add the date and time.";
    }
    if (!form.notes.trim()) {
      nextErrors.notes = "Add a few details that can help identify the pet.";
    }
    if (!form.contactPhone.trim() && !form.contactEmail.trim()) {
      nextErrors.contactPhone = "Add at least one contact method.";
      nextErrors.contactEmail = "Add at least one contact method.";
    }
    if (form.contactEmail.trim() && !isValidEmail(form.contactEmail.trim())) {
      nextErrors.contactEmail = "Enter a valid email address.";
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleClearDraft() {
    const resetForm = createInitialForm(user?.email || "");
    setForm(resetForm);
    setImageFile(null);
    setFieldErrors({});
    setSubmitError("");
    window.localStorage.removeItem(draftKey);
  }

  async function handleSubmit(e) {
  e.preventDefault();
  setSubmitError("");

  if (!validate()) return;
  if (loading) return;

  const { data: authData, error: authError } = await supabase.auth.getUser();
  const currentUser = authData?.user ?? null;

  if (authError || !currentUser) {
    window.localStorage.setItem(draftKey, JSON.stringify(form));
    navigate(`/login?next=/${mode}`);
    return;
  }

  try {
    let imageUrl = "";
    if (imageFile) {
      const upload = await uploadPublicImage({
        bucket: "posts",
        file: imageFile,
        userId: currentUser.id,
      });
      imageUrl = upload?.publicUrl || "";
    }

    const title = buildReportTitle({
      mode,
      petName: form.petName,
      species: form.species,
      breed: form.breed,
      color: form.color,
    });

    const description = buildReportDescription({
      notes: form.notes,
      meta: {
        species: form.species,
        breed: form.breed,
        age: form.age,
        gender: form.gender,
        size: form.size,
        color: form.color,
        microchip: form.microchip,
        event_at: form.eventAt,
        contact_name: form.contactName,
        contact_phone: form.contactPhone,
        contact_email: form.contactEmail || currentUser.email,
      },
    });

    const payload = {
      user_id: currentUser.id,
      title,
      description,
      status: mode,
      latitude: form.location.lat,
      longitude: form.location.lng,
      location_address: form.location.address,
      ...(imageUrl ? { image_url: imageUrl } : {}),
    };

    console.log("creating post as user:", currentUser.id);
    console.log("payload:", payload);

    const created = await createPost.mutateAsync(payload);

    window.localStorage.removeItem(draftKey);
    setImageFile(null);
    navigate(`/posts/${created.id}`);
  } catch (error) {
    console.error("create post failed:", error);
    setSubmitError(error?.message || "We couldn't publish the report right now. Please try again.");
  }
}

  return (
    <VStack align="center" style={{ textAlign: "center" }}>
      <VStack gap={4} align="center" paddingX={6} style={{ marginBottom: 24 }}>
        <Badge variant={mode === "found" ? "warning" : "error"}>{copy.badge}</Badge>
        <Text variant="h1">{copy.title}</Text>
        <Text variant="lg" color="muted" style={{ maxWidth: "46ch" }}>
          {copy.subtitle}
        </Text>
      </VStack>

      <Container size="lg">
        {!user && (
          <div className={styles.authNotice}>
            <HStack gap={3} align="center" wrap justify="between" className={styles.authNoticeRow}>
              <HStack gap={2} align="center">
                <LogIn size={18} />
                <Text variant="body" weight="600">Sign in is required to publish a report</Text>
              </HStack>
              <Button variant="outline" size="sm" onClick={() => navigate(`/login?next=/${mode}`)}>
                Sign In
              </Button>
            </HStack>
            <Text variant="sm" color="muted" align="left">
              You can still fill out the form below. We'll keep your draft on this device and bring you back after login.
            </Text>
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.shell}>
            <div className={styles.mainColumn}>
              <section className={styles.sectionCard}>
                <HStack gap={2} align="center" className={styles.sectionHeading}>
                  <Search size={18} />
                  <Text variant="h3">Photo & pet details</Text>
                </HStack>
                <Text variant="sm" color="muted" align="left">
                  Add a clear photo first if you have one. It makes reports much easier to scan.
                </Text>

                <ImageUpload
                  value={imageFile}
                  onChange={setImageFile}
                  onClear={() => setImageFile(null)}
                />

                <div className={styles.gridTwo}>
                  <Input
                    label={mode === "lost" ? "Pet name" : "Pet name or identifying label"}
                    id={`${mode}-pet-name`}
                    value={form.petName}
                    onChange={(e) => updateField("petName", e.target.value)}
                    placeholder={mode === "lost" ? "Buddy" : "Brown tabby cat"}
                    error={fieldErrors.petName}
                  />
                  <Select
                    label="Species"
                    id={`${mode}-species`}
                    value={form.species}
                    onChange={(e) => updateField("species", e.target.value)}
                    options={SPECIES_OPTIONS}
                  />
                  <Input
                    label="Breed"
                    id={`${mode}-breed`}
                    value={form.breed}
                    onChange={(e) => updateField("breed", e.target.value)}
                    placeholder="Golden Retriever"
                  />
                  <Input
                    label="Color / markings"
                    id={`${mode}-color`}
                    value={form.color}
                    onChange={(e) => updateField("color", e.target.value)}
                    placeholder="Black with white chest"
                  />
                  <Input
                    label="Age"
                    id={`${mode}-age`}
                    value={form.age}
                    onChange={(e) => updateField("age", e.target.value)}
                    placeholder="2 years, senior, puppy..."
                  />
                  <Select
                    label="Gender"
                    id={`${mode}-gender`}
                    value={form.gender}
                    onChange={(e) => updateField("gender", e.target.value)}
                    options={GENDER_OPTIONS}
                  />
                  <Select
                    label="Size"
                    id={`${mode}-size`}
                    value={form.size}
                    onChange={(e) => updateField("size", e.target.value)}
                    options={SIZE_OPTIONS}
                  />
                  <Select
                    label="Microchip status"
                    id={`${mode}-microchip`}
                    value={form.microchip}
                    onChange={(e) => updateField("microchip", e.target.value)}
                    options={MICROCHIP_OPTIONS}
                  />
                </div>
              </section>

              <section className={styles.sectionCard}>
                <HStack gap={2} align="center" className={styles.sectionHeading}>
                  <MapPin size={18} />
                  <Text variant="h3">Where and when</Text>
                </HStack>
                <div className={styles.gridSingle}>
                  <div>
                    <Text variant="sm" color="muted" align="left" style={{ marginBottom: 8 }}>
                      {copy.locationLabel}
                    </Text>
                    <LocationInput
                      value={form.location}
                      onChange={(value) => {
                        setForm((prev) => ({ ...prev, location: value }));
                        setFieldErrors((prev) => {
                          if (!prev.location) return prev;
                          const next = { ...prev };
                          delete next.location;
                          return next;
                        });
                      }}
                      onSubmit={() => {}}
                      placeholder={copy.locationPlaceholder}
                      error={fieldErrors.location}
                      dropDown
                    />
                  </div>
                  <Input
                    label={copy.eventLabel}
                    id={`${mode}-event-at`}
                    type="datetime-local"
                    value={form.eventAt}
                    onChange={(e) => updateField("eventAt", e.target.value)}
                    error={fieldErrors.eventAt}
                  />
                </div>
              </section>

              <section className={styles.sectionCard}>
                <HStack gap={2} align="center" className={styles.sectionHeading}>
                  <ShieldCheck size={18} />
                  <Text variant="h3">Additional details</Text>
                </HStack>
                <Input
                  label="Notes"
                  id={`${mode}-notes`}
                  type="textarea"
                  value={form.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                  placeholder={copy.notesPlaceholder}
                  error={fieldErrors.notes}
                />
              </section>
            </div>

            <aside className={styles.sideColumn}>
              <section className={styles.sideCard}>
                <HStack gap={2} align="center" className={styles.sectionHeading}>
                  <Clock3 size={18} />
                  <Text variant="h3">Contact info</Text>
                </HStack>
                <Text variant="sm" color="muted" align="left">
                  Add the best way for someone to reach you if they have information.
                </Text>
                <VStack gap={4}>
                  <Input
                    label="Contact name"
                    id={`${mode}-contact-name`}
                    value={form.contactName}
                    onChange={(e) => updateField("contactName", e.target.value)}
                    placeholder="Jane Doe"
                  />
                  <Input
                    label="Phone"
                    id={`${mode}-contact-phone`}
                    type="tel"
                    value={form.contactPhone}
                    onChange={(e) => updateField("contactPhone", e.target.value)}
                    placeholder="(530) 555-0199"
                    error={fieldErrors.contactPhone}
                  />
                  <Input
                    label="Email"
                    id={`${mode}-contact-email`}
                    type="email"
                    value={form.contactEmail}
                    onChange={(e) => updateField("contactEmail", e.target.value)}
                    placeholder="you@example.com"
                    error={fieldErrors.contactEmail}
                  />
                </VStack>
              </section>

              <section className={styles.sideCard}>
                <Text variant="h3" align="left">Checklist</Text>
                <VStack gap={3} className={styles.checklist}>
                  <div className={styles.checkItem}>
                    <CheckCircle2 size={16} />
                    <Text variant="sm" color="muted">Use a recent photo with the full face or body visible.</Text>
                  </div>
                  <div className={styles.checkItem}>
                    <CheckCircle2 size={16} />
                    <Text variant="sm" color="muted">Be precise about where the pet was last seen or found.</Text>
                  </div>
                  <div className={styles.checkItem}>
                    <CheckCircle2 size={16} />
                    <Text variant="sm" color="muted">Include collar, tag, temperament, and special markings in the notes.</Text>
                  </div>
                </VStack>
                <Divider style={{ margin: "4px 0" }} />
                <Text variant="sm" color="muted" align="left">
                  Drafts are saved automatically on this device until you publish or clear the form.
                </Text>
              </section>
            </aside>
          </div>

          {submitError && (
            <div className={styles.errorBanner} role="alert">
              <AlertCircle size={18} />
              <span>{submitError}</span>
            </div>
          )}

          <HStack gap={3} wrap justify="between" className={styles.footerRow}>
            <Button variant="ghost" onClick={handleClearDraft}>
              Clear Draft
            </Button>
            <HStack gap={3} wrap>
              <Button
                variant="primary"
                size="lg"
                type="submit"
                loading={createPost.isPending}
                disabled={loading || createPost.isPending}
              >
                {copy.submitLabel}
              </Button>
            </HStack>
          </HStack>
        </form>
      </Container>
    </VStack>
  );
}
