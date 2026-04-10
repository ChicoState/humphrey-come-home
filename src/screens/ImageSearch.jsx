/**
 * ImageSearch — placeholder screen for image-based pet search.
 * Currently shows a "coming soon" empty state. Route: /image-search
 */
import { useNavigate } from "react-router";
import { Camera } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";

export default function ImageSearch() {
  const navigate = useNavigate();
  return (
    <EmptyState
      badge="Coming soon"
      icon={Camera}
      title="Image Search"
      subtitle="This feature is coming soon. You'll be able to upload a photo to find matching pets."
      button={{ onPress: () => navigate(-1), label: "Go Back" }}
    />
  );
}
