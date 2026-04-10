/**
 * PrivacyPolicy — static legal page (placeholder content). Route: /privacy
 */
import { VStack, Text, Container } from "@/components/primitives";

export default function PrivacyPolicy() {
  return (
    <Container size="md">
      <VStack gap={2}>
        <Text variant="h2">Privacy Policy</Text>
        <Text variant="sm" color="light" style={{ marginBottom: 16 }}>Last updated: March 2026</Text>
      </VStack>

      <VStack gap={5}>
        <Text variant="body">
          Humphrey Come Home (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to
          protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard
          your information when you use our platform.
        </Text>

        <VStack gap={2}>
          <Text variant="h3">Information We Collect</Text>
          <Text variant="body">
            We collect information you provide directly, such as your name, email address, and location
            data when you create an account or submit a lost/found pet report. We may also collect
            photos you upload and location information to help match pets with their owners.
          </Text>
        </VStack>

        <VStack gap={2}>
          <Text variant="h3">How We Use Your Information</Text>
          <Text variant="body">
            Your information is used to operate and improve our pet reunion services, display lost and
            found reports, connect pet owners with finders, and communicate with you about your
            account and reports.
          </Text>
        </VStack>

        <VStack gap={2}>
          <Text variant="h3">Data Security</Text>
          <Text variant="body">
            We implement appropriate security measures to protect your personal information. However,
            no method of transmission over the internet is 100% secure.
          </Text>
        </VStack>

        <Text variant="sm" color="light" style={{ fontStyle: "italic", marginTop: 8 }}>
          Full privacy policy details are coming soon. If you have questions, please contact us.
        </Text>
      </VStack>
    </Container>
  );
}
