/**
 * PostDetail — displays a single lost/found post.
 * Shows image, status, parsed report metadata, and owner actions.
 * Route: /posts/:id
 */
import { useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import { Calendar, CheckCircle, Mail, MapPin, Phone, SearchX } from "lucide-react";
import { VStack, HStack, Text, Container } from "@/components/primitives";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import Spinner from "@/components/ui/Spinner";
import { useAuth } from "@/hooks/useAuth";
import { usePost, useUpdatePost } from "@/hooks/queries/usePosts";
import formatDate from "@/lib/formatDate";
import { getReportFieldLabel, parseReportDescription } from "@/lib/reportDescription";
import styles from "./PostDetail.module.css";

const STATUS_CONFIG = {
  lost: { label: "Lost", variant: "error" },
  found: { label: "Found", variant: "warning" },
  reunited: { label: "Reunited", variant: "success" },
};

function formatEventDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: post, isLoading, isError } = usePost(id);
  const updatePost = useUpdatePost();

  const parsed = useMemo(
    () => parseReportDescription(post?.description),
    [post?.description],
  );

  async function handleMarkReunited() {
    try {
      await updatePost.mutateAsync({ id, status: "reunited" });
    } catch {
      // Error handled by TanStack Query
    }
  }

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <EmptyState
        icon={SearchX}
        title="Post not found"
        subtitle="This post may have been removed or doesn't exist."
        button={{ onPress: () => navigate("/"), label: "Back to Home" }}
      />
    );
  }

  const statusInfo = STATUS_CONFIG[post.status] || STATUS_CONFIG.lost;
  const isOwner = user?.id && post.user_id === user.id;
  const statItems = [
    { key: "species", value: parsed.meta.species },
    { key: "breed", value: parsed.meta.breed },
    { key: "age", value: parsed.meta.age },
    { key: "gender", value: parsed.meta.gender },
    { key: "size", value: parsed.meta.size },
    { key: "color", value: parsed.meta.color },
    { key: "microchip", value: parsed.meta.microchip },
  ].filter((item) => item.value);

  const contactItems = [
    { key: "contact_name", value: parsed.meta.contact_name },
    { key: "contact_phone", value: parsed.meta.contact_phone, icon: Phone },
    { key: "contact_email", value: parsed.meta.contact_email, icon: Mail },
  ].filter((item) => item.value);

  const notes = parsed.notes || post.description;
  const eventAt = formatEventDate(parsed.meta.event_at);

  return (
    <Container size="md" padding={0}>
      {post.image_url && (
        <img
          src={post.image_url}
          alt={post.title}
          className={styles.image}
        />
      )}

      <VStack gap={4}>
        <VStack gap={2}>
          <Badge variant={statusInfo.variant}>
            {statusInfo.label}
          </Badge>
          <Text variant="h1">{post.title}</Text>
        </VStack>

        <HStack gap={4} wrap className={styles.metaRow}>
          {post.location_address && (
            <span className={styles.metaItem}>
              <MapPin size={16} /> {post.location_address}
            </span>
          )}
          {eventAt && (
            <span className={styles.metaItem}>
              <Calendar size={16} /> {getReportFieldLabel("event_at", post.status)}: {eventAt}
            </span>
          )}
          {post.created_at && (
            <span className={styles.metaItem}>
              <Calendar size={16} /> Reported {formatDate(post.created_at, "long")}
            </span>
          )}
        </HStack>

        {statItems.length > 0 && (
          <div className={styles.statGrid}>
            {statItems.map((item) => (
              <div key={item.key} className={styles.statCard}>
                <Text variant="body" weight="700">{item.value}</Text>
                <Text variant="xs" color="secondary">{getReportFieldLabel(item.key, post.status)}</Text>
              </div>
            ))}
          </div>
        )}

        {notes && (
          <VStack gap={2} className={styles.section}>
            <Text variant="label" color="muted">Description</Text>
            <Text variant="body">{notes}</Text>
          </VStack>
        )}

        {contactItems.length > 0 && (
          <VStack gap={2} className={styles.section}>
            <Text variant="label" color="muted">Contact</Text>
            <div className={styles.contactList}>
              {contactItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.key} className={styles.contactRow}>
                    {Icon ? <Icon size={16} /> : <span className={styles.contactDot} />}
                    <Text variant="body">{item.value}</Text>
                  </div>
                );
              })}
            </div>
          </VStack>
        )}

        {isOwner && post.status !== "reunited" && (
          <div className={styles.ownerActions}>
            <Button
              variant="primary"
              icon={CheckCircle}
              onClick={handleMarkReunited}
              loading={updatePost.isPending}
              disabled={updatePost.isPending}
            >
              Mark as Reunited
            </Button>
          </div>
        )}

        {post.status === "reunited" && (
          <HStack gap={2} align="center" className={styles.reunitedBanner}>
            <CheckCircle size={20} />
            <Text variant="body" weight="600">This pet has been reunited with their family!</Text>
          </HStack>
        )}
      </VStack>
    </Container>
  );
}
