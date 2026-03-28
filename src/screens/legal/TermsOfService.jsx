/**
 * TermsOfService — static legal page (placeholder content). Route: /terms
 */
import { VStack, Text, Container } from "@/components/primitives";

export default function TermsOfService() {
  return (
    <Container size="md">
      <VStack gap={2}>
        <Text variant="h2">Terms of Service</Text>
        <Text variant="sm" color="light" style={{ marginBottom: 16 }}>Last updated: March 2026</Text>
      </VStack>

      <VStack gap={5}>
        <Text variant="body">
          Welcome to Humphrey Come Home. By accessing or using our platform, you agree to be bound
          by these Terms of Service. Please read them carefully.
        </Text>

        <VStack gap={2}>
          <Text variant="h3">Use of the Platform</Text>
          <Text variant="body">
            Humphrey Come Home is a community platform designed to help reunite lost pets with their
            owners. You agree to use the platform only for its intended purpose and to provide
            accurate information in any reports you submit.
          </Text>
        </VStack>

        <VStack gap={2}>
          <Text variant="h3">User Accounts</Text>
          <Text variant="body">
            You are responsible for maintaining the confidentiality of your account credentials and
            for all activity that occurs under your account. You must be at least 13 years of age to
            create an account.
          </Text>
        </VStack>

        <VStack gap={2}>
          <Text variant="h3">Content Guidelines</Text>
          <Text variant="body">
            You retain ownership of content you post, but grant us a license to display it on the
            platform. You agree not to post false reports, misleading information, or content that
            violates others&apos; rights.
          </Text>
        </VStack>

        <Text variant="sm" color="light" style={{ fontStyle: "italic", marginTop: 8 }}>
          Full terms of service details are coming soon. If you have questions, please contact us.
        </Text>
      </VStack>
    </Container>
  );
}
