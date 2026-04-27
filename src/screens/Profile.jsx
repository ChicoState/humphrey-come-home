/**
 * Profile — user profile page showing avatar, name, email, location,
 * join date, and a list of the user's posts.
 * Requires auth — shows sign-in prompt if not logged in. Route: /profile
 */
import { useNavigate } from "react-router";
import { FileText, MapPin, Calendar, Settings, Camera } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import Spinner from "@/components/ui/Spinner";
import { VStack, HStack, Text, Container, Divider } from "@/components/primitives";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/queries/useProfile";
import { usePosts } from "@/hooks/queries/usePosts";
import formatDate from "@/lib/formatDate";
import styles from "./Profile.module.css";

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile(user?.id);
  const { data: userPosts, isLoading: postsLoading } = usePosts(
    user ? { userId: user.id } : null,
  );

  if (profileLoading) {
    return <div className={styles.loading}><Spinner size="lg" /></div>;
  }

  const displayName = profile?.name || user?.email?.split("@")[0] || "User";
  const avatarUrl = profile?.avatar_url;
  const initial = displayName[0]?.toUpperCase();

  return (
    <VStack align="center" style={{ textAlign: 'center' }}>
      {/* Avatar + Info */}
      <VStack gap={4} align="center" paddingX={6} style={{ marginBottom: 24 }}>
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className={styles.avatar} />
            ) : (
              <div className={styles.avatarFallback}>{initial}</div>
            )}

            <VStack gap={1} align="center">
              <Text variant="h1">{displayName}</Text>
              <Text variant="body" color="muted">{user.email}</Text>
            </VStack>

            <HStack gap={4} align="center" wrap justify="center">
              {profile?.home_location && (
                <span className={styles.detail}>
                  <MapPin size={14} /> {profile.home_location}
                </span>
              )}
              <span className={styles.detail}>
                <Calendar size={14} /> Joined {formatDate(profile?.joined_at || user.created_at, "month-year")}
              </span>
            </HStack>

            <HStack gap={2}>
              <Button variant="outline" size="sm" icon={Settings} onClick={() => navigate("/settings")}>
                Settings
              </Button>
              <Button variant="outline" size="sm" icon={Camera} onClick={() => navigate("/settings")}>
                Edit Photo
              </Button>
            </HStack>
      </VStack>

      {/* Posts */}
      <Container size="md" style={{ paddingTop: 24 }}>
        <Divider label="Your Posts" />

        {postsLoading ? (
          <div className={styles.loading}><Spinner size="lg" /></div>
        ) : userPosts?.length > 0 ? (
          <VStack gap={1}>
            {userPosts.map((post) => (
              <button
                key={post.id}
                className={styles.postRow}
                onClick={() => navigate(`/posts/${post.id}`)}
              >
                <Badge variant={{ lost: 'error', found: 'warning', reunited: 'success' }[post.status]}>
                  {post.status}
                </Badge>
                <Text variant="body" className={styles.postTitle}>{post.title}</Text>
                <Text variant="xs" color="light" style={{ flexShrink: 0 }}>{formatDate(post.created_at)}</Text>
              </button>
            ))}
          </VStack>
        ) : (
          <EmptyState
            compact
            icon={FileText}
            title="No posts yet"
            subtitle="Report a lost or found animal to create your first post."
            button={{ onPress: () => navigate("/lost"), label: "Report Lost" }}
          />
        )}
      </Container>
    </VStack>
  );
}
