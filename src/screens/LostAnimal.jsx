/**
 * LostAnimal — placeholder screen for the "Report Lost" flow.
 * Currently shows a "coming soon" empty state. Route: /lost
 */
import { useNavigate } from "react-router";
import { Search } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";

export default function LostAnimal() {
  const navigate = useNavigate();
  return (
    <EmptyState
      badge="Coming soon"
      icon={Search}
      title="Report Lost Pet"
      subtitle="This feature is coming soon. We're working on making it easy to report and find lost pets."
      button={{ onPress: () => navigate(-1), label: "Go Back" }}
    />
  );
}
