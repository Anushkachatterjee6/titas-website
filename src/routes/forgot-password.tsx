import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthLayout, AuthField, AuthError, AuthNotice } from "@/components/site/AuthLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

const title = "Forgot Password | TiTAS";
const description = "Reset the password for your TiTAS account.";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setSubmitting(true);
    const { error: resetError } = await requestPasswordReset(email);
    setSubmitting(false);
    if (resetError) {
      setError(resetError);
      return;
    }
    setNotice("If an account exists for that email, we've sent a password reset link.");
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your account email and we'll send you a reset link."
      footer={
        <Link to="/login" className="font-semibold text-primary hover:underline">
          Back to Login
        </Link>
      }
    >
      <form className="grid gap-5" onSubmit={handleSubmit}>
        <AuthError message={error} />
        <AuthNotice message={notice} />

        <AuthField label="Email" htmlFor="forgot-email">
          <Input
            id="forgot-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </AuthField>

        <Button type="submit" variant="brand" size="xl" disabled={submitting}>
          {submitting ? "Sending…" : "Send Reset Link"}
        </Button>
      </form>
    </AuthLayout>
  );
}
