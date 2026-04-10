/**
 * PostCard — clickable card for lost/found community reports.
 *
 * @prop {object} post
 * @prop {boolean} [compact]
 */
import { useNavigate } from "react-router";
import { Calendar, MapPin } from "lucide-react";
import Badge from "./Badge";
import Card from "./Card";
import { HStack, Text, VStack } from "@/components/primitives";
import formatDate from "@/lib/formatDate";
import { parseReportDescription } from "@/lib/reportDescription";
import styles from "./PostCard.module.css";

const STATUS_VARIANTS = {
  lost: "error",
  found: "warning",
  reunited: "success",
};

export default function PostCard({ post, compact = false }) {
  const navigate = useNavigate();
  const { notes } = parseReportDescription(post?.description);

  return (
    <Card onClick={() => navigate(`/posts/${post.id}`)} className={`${styles.card} ${compact ? styles.compact : ""}`}>
      {post.image_url && (
        <img src={post.image_url} alt={post.title} className={styles.image} />
      )}

      <VStack gap={2} className={styles.content}>
        <HStack gap={2} align="center" wrap>
          <Badge variant={STATUS_VARIANTS[post.status] || "info"}>{post.status}</Badge>
          <Text variant="h3" className={styles.title}>{post.title}</Text>
        </HStack>

        <HStack gap={3} wrap className={styles.meta}>
          {post.location_address && (
            <span className={styles.metaItem}>
              <MapPin size={14} /> {post.location_address}
            </span>
          )}
          {post.distanceLabel && (
            <span className={styles.metaItem}>
              <MapPin size={14} /> {post.distanceLabel}
            </span>
          )}
          {post.created_at && (
            <span className={styles.metaItem}>
              <Calendar size={14} /> {formatDate(post.created_at)}
            </span>
          )}
        </HStack>

        {!compact && notes && (
          <Text variant="sm" color="muted" className={styles.excerpt}>
            {notes}
          </Text>
        )}
      </VStack>
    </Card>
  );
}
