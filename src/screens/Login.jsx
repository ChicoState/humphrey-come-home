/**
 * Login — two-step OTP authentication screen.
 * Step 1: user enters their email, receives a one-time code.
 * Step 2: user enters the code to verify and log in.
 * Redirects home (or a requested next route) on success. Route: /login
 */
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { VStack, Text, Container } from "@/components/primitives";
import { useAuth } from "@/hooks/useAuth";
import styles from "./Login.module.css";

function getSafeNextPath(value) {
  if (!value || typeof value !== "string") return "/";
  return value.startsWith("/") ? value : "/";
}

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signInWithOtp, verifyOtp } = useAuth();
  const nextPath = getSafeNextPath(searchParams.get("next"));

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState("email"); // "email" | "code"
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSendCode(e) {
    e.preventDefault();
    setError("");
    if (!email) { setError("Please enter your email."); return; }

    setLoading(true);
    try {
      await signInWithOtp(email);
      setStep("code");
    } catch (err) {
      setError(err?.message || "Failed to send code. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e) {
    e.preventDefault();
    setError("");
    if (!code) { setError("Please enter the code."); return; }

    setLoading(true);
    try {
      await verifyOtp(email, code);
      navigate(nextPath);
    } catch (err) {
      setError(err?.message || "Invalid code. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <VStack align="center" style={{ textAlign: "center" }}>
      <VStack gap={4} align="center" paddingX={6} style={{ marginBottom: 24 }}>
        <Text variant="h1">{step === "email" ? "Sign In" : "Check your email"}</Text>
        <Text variant="lg" color="muted" style={{ maxWidth: "44ch" }}>
          {step === "email"
            ? "We'll send a code to your email"
            : `Enter the 6-digit code sent to ${email}`}
        </Text>
      </VStack>

      <Container size="sm">
        {error && <div className={styles.error} role="alert">{error}</div>}

        {step === "email" ? (
          <form onSubmit={handleSendCode} className={styles.form}>
            <Input
              label="Email"
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="you@example.com"
            />
            <Button variant="primary" size="lg" block type="submit" loading={loading}>
              Send Code
            </Button>
          </form>
        ) : (
          <>
            <form onSubmit={handleVerify} className={styles.form}>
              <Input
                label="Code"
                id="code"
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                autoComplete="one-time-code"
                placeholder="123456"
                inputMode="numeric"
              />
              <Button variant="primary" size="lg" block type="submit" loading={loading}>
                Verify
              </Button>
            </form>

            <Text variant="sm" color="muted" align="center" style={{ marginTop: 12 }}>
              Wrong email?{" "}
              <button
                type="button"
                className={styles.link}
                onClick={() => { setStep("email"); setCode(""); setError(""); }}
              >
                Go back
              </button>
            </Text>
          </>
        )}
      </Container>
    </VStack>
  );
}
