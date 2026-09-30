import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthLayout, AuthField, AuthError, AuthNotice } from "@/components/site/AuthLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

const title = "Set New Password | TiTAS";
const description = "Set a new password for your TiTAS account.";

export const Route = createFileRoute("/reset-password")({
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
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const { user, loading, updatePassword } = useAuth();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setSubmitting(true);
    const { error: updateError } = await updatePassword(password);
    setSubmitting(false);
    if (updateError) {
      setError(updateError);
      return;
    }
    setDone(true);
    setTimeout(() => navigate({ to: "/account", replace: true }), 1500);
  };

  if (loading) {
    return (
      <AuthLayout title="Set new password">
        <p className="text-center text-sm text-muted-foreground">Checking your reset link…</p>
      </AuthLayout>
    );
  }

  if (!user) {
    return (
      <AuthLayout
        title="This reset link isn't valid"
        subtitle="It may have expired, or already been used."
        footer={
          <Link to="/forgot-password" className="font-semibold text-primary hover:underline">
            Request a new link
          </Link>
        }
      >
        <p className="text-center text-sm text-muted-foreground">
          Please request a fresh password reset link and try again.
        </p>
      </AuthLayout>
    );
  }

  if (done) {
    return (
      <AuthLayout title="Password updated">
        <AuthNotice message="Your password has been changed. Taking you to your account…" />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Set a new password" subtitle="Choose a new password for your TiTAS account.">
      <form className="grid gap-5" onSubmit={handleSubmit}>
        <AuthError message={error} />

        <AuthField label="New Password" htmlFor="reset-password">
          <Input
            id="reset-password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </AuthField>

        <AuthField label="Confirm New Password" htmlFor="reset-confirm">
          <Input
            id="reset-confirm"
            type="password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
          />
        </AuthField>

        <Button type="submit" variant="brand" size="xl" disabled={submitting}>
          {submitting ? "Updating…" : "Update Password"}
        </Button>
      </form>
    </AuthLayout>
  );
}
