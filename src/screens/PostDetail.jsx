/**
 * PostDetail — displays a single lost/found post.
 * Shows image, title, status badge, location, date, and description.
 * Post owner can mark the post as "reunited".
 * Route: /posts/:id
 */
import { useParams, useNavigate } from "react-router";
import { MapPin, Calendar, ArrowLeft, CheckCircle, SearchX } from "lucide-react";
import { VStack, HStack, Text } from "@/components/primitives";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import { useAuth } from "@/hooks/useAuth";
import { usePost, useUpdatePost } from "@/hooks/queries/usePosts";
import formatDate from "@/lib/formatDate";
import styles from "./PostDetail.module.css";

const STATUS_CONFIG = {
  lost: { label: "Lost", className: "statusLost" },
  found: { label: "Found", className: "statusFound" },
  reunited: { label: "Reunited", className: "statusReunited" },
};

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: post, isLoading, isError } = usePost(id);
  const updatePost = useUpdatePost();

  async function handleMarkReunited() {
    try {
      await updatePost.mutateAsync({ id, status: "reunited" });
    } catch {
      // Error handled by TanStack Query
    }
  }

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
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
        button={{ onPress: () => navigate('/'), label: 'Back to Home' }}
      />
    );
  }

  const statusInfo = STATUS_CONFIG[post.status] || STATUS_CONFIG.lost;
  const isOwner = user?.id && post.user_id === user.id;

  return (
    <div className={styles.page}>
      <button
        className={styles.backButton}
        onClick={() => navigate(-1)}
        type="button"
      >
        <ArrowLeft size={18} /> Back
      </button>

      <article className={styles.article}>
        {post.image_url && (
          <img
            src={post.image_url}
            alt={post.title}
            className={styles.image}
          />
        )}

        <div className={styles.content}>
          <VStack gap={2}>
            <span className={`${styles.badge} ${styles[statusInfo.className]}`}>
              {statusInfo.label}
            </span>
            <Text variant="h1">{post.title}</Text>
          </VStack>

          <HStack gap={4} wrap className={styles.meta}>
            {post.location_address && (
              <HStack gap={1} align="center">
                <MapPin size={16} />
                <Text variant="sm" color="muted">{post.location_address}</Text>
              </HStack>
            )}
            {post.created_at && (
              <HStack gap={1} align="center">
                <Calendar size={16} />
                <Text variant="sm" color="muted">{formatDate(post.created_at, "long")}</Text>
              </HStack>
            )}
          </HStack>

          {post.description && (
            <VStack gap={2}>
              <Text variant="label" color="muted">Description</Text>
              <Text variant="body">{post.description}</Text>
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
        </div>
      </article>
    </div>
  );
}
