/**
 * NotFound — 404 page shown for unmatched routes.
 */
import { useNavigate } from "react-router";
import { PawPrint } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <EmptyState
      icon={PawPrint}
      title="404"
      subtitle="Looks like this page wandered off... We couldn't find the page you're looking for."
      button={{ onPress: () => navigate(-1), label: 'Go Back' }}
    />
  );
}
