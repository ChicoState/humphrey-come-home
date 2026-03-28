/**
 * AnimalDetail — pet detail screen skeleton.
 * Route: /animals/:id
 */
import { useNavigate } from "react-router";
import { PawPrint } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";

export default function AnimalDetail() {
  const navigate = useNavigate();

  return (
    <EmptyState
      badge="Coming soon"
      icon={PawPrint}
      title="Pet Details"
      subtitle="This feature is coming soon. You'll be able to view detailed information about shelter animals."
      button={{ onPress: () => navigate(-1), label: 'Go Back' }}
    />
  );
}
