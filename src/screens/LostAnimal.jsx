/**
 * LostAnimal — report lost pet flow.
 * Route: /lost
 */
import ReportPetForm from "@/components/forms/ReportPetForm";

export default function LostAnimal() {
  return <ReportPetForm mode="lost" />;
}
