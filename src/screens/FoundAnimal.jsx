/**
 * FoundAnimal — placeholder screen for the "Report Found" flow.
 * Currently shows a "coming soon" empty state. Route: /found
 */
import { useNavigate } from "react-router";
import { PawPrint } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";

export default function FoundAnimal() {
  const navigate = useNavigate();
  return (
    <EmptyState
      badge="Coming soon"
      icon={PawPrint}
      title="Report Found Pet"
      subtitle="This feature is coming soon. We're working on making it easy to report found pets and reunite them."
      button={{ onPress: () => navigate(-1), label: "Go Back" }}
    />
  );
}
