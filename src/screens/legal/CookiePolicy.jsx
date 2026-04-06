/**
 * CookiePolicy — static legal page (placeholder content). Route: /cookies
 */
import { VStack, Text, Container } from "@/components/primitives";

export default function CookiePolicy() {
  return (
    <Container size="md">
      <VStack gap={2}>
        <Text variant="h2">Cookie Policy</Text>
        <Text variant="sm" color="light" style={{ marginBottom: 16 }}>Last updated: March 2026</Text>
      </VStack>

      <VStack gap={5}>
        <Text variant="body">
          Humphrey Come Home uses cookies and similar technologies to provide, protect, and improve
          our platform. This policy explains what cookies are, how we use them, and your choices.
        </Text>

        <VStack gap={2}>
          <Text variant="h3">What Are Cookies</Text>
          <Text variant="body">
            Cookies are small text files stored on your device when you visit a website. They help
            the site remember your preferences and understand how you use the platform.
          </Text>
        </VStack>

        <VStack gap={2}>
          <Text variant="h3">How We Use Cookies</Text>
          <Text variant="body">
            We use essential cookies to keep you signed in and maintain your session. We may also use
            analytics cookies to understand usage patterns and improve the platform experience.
          </Text>
        </VStack>

        <VStack gap={2}>
          <Text variant="h3">Your Choices</Text>
          <Text variant="body">
            You can manage cookie preferences through your browser settings. Note that disabling
            certain cookies may affect platform functionality.
          </Text>
        </VStack>

        <Text variant="sm" color="light" style={{ fontStyle: "italic", marginTop: 8 }}>
          Full cookie policy details are coming soon. If you have questions, please contact us.
        </Text>
      </VStack>
    </Container>
  );
}
