import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { AuthLayout, AuthField, AuthError } from "@/components/site/AuthLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

const title = "Create Account | TiTAS";
const description = "Create a TiTAS account to order packaged drinking water and track your orders.";

const searchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/signup")({
  validateSearch: searchSchema,
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
  component: SignupPage,
});

const PHONE_PATTERN = /^[0-9+()\-\s]{7,15}$/;

function SignupPage() {
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!PHONE_PATTERN.test(phone.trim())) {
      setError("Please enter a valid mobile number.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setSubmitting(true);
    const { error: signUpError } = await signUp({
      fullName: fullName.trim(),
      phone: phone.trim(),
      email,
      password,
    });
    setSubmitting(false);

    if (signUpError) {
      setError(signUpError);
      return;
    }

    // Email confirmation is disabled — signUp already returned an active
    // session, so the new account can go straight into the app.
    navigate({ to: redirect || "/account", replace: true });
  };

  return (
    <AuthLayout
      title="Create your TiTAS account"
      subtitle="Sign up to order and track your TiTAS deliveries."
      footer={
        <>
          Already have an account?{" "}
          <Link
            to="/login"
            search={redirect ? { redirect } : {}}
            className="font-semibold text-primary hover:underline"
          >
            Login
          </Link>
        </>
      }
    >
      <form className="grid gap-5" onSubmit={handleSubmit}>
        <AuthError message={error} />

        <AuthField label="Full Name" htmlFor="signup-name">
          <Input
            id="signup-name"
            autoComplete="name"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your full name"
          />
        </AuthField>

        <AuthField label="Mobile Number" htmlFor="signup-phone">
          <Input
            id="signup-phone"
            type="tel"
            autoComplete="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. 9051019995"
          />
        </AuthField>

        <AuthField label="Email" htmlFor="signup-email">
          <Input
            id="signup-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </AuthField>

        <div className="grid gap-5 sm:grid-cols-2">
          <AuthField label="Password" htmlFor="signup-password">
            <Input
              id="signup-password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </AuthField>
          <AuthField label="Confirm Password" htmlFor="signup-confirm">
            <Input
              id="signup-confirm"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
            />
          </AuthField>
        </div>

        <Button type="submit" variant="brand" size="xl" disabled={submitting}>
          {submitting ? "Creating account…" : "Create Account"}
        </Button>
      </form>
    </AuthLayout>
  );
}
