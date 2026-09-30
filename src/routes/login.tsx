import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { AuthLayout, AuthField, AuthError } from "@/components/site/AuthLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

const title = "Login | TiTAS";
const description = "Log in to your TiTAS account to check out and manage your orders.";

const searchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/login")({
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
  component: LoginPage,
});

function LoginPage() {
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error: signInError } = await signIn(email, password);
    setSubmitting(false);
    if (signInError) {
      setError(signInError);
      return;
    }
    navigate({ to: redirect || "/account", replace: true });
  };

  return (
    <AuthLayout
      title="Welcome to TiTAS"
      subtitle="Log in to continue to your account."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            search={redirect ? { redirect } : {}}
            className="font-semibold text-primary hover:underline"
          >
            Create Account
          </Link>
        </>
      }
    >
      <form className="grid gap-5" onSubmit={handleSubmit}>
        <AuthError message={error} />

        <AuthField label="Email" htmlFor="login-email">
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </AuthField>

        <AuthField label="Password" htmlFor="login-password">
          <Input
            id="login-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </AuthField>

        <Link
          to="/forgot-password"
          className="-mt-2 justify-self-end text-xs font-medium text-primary hover:underline"
        >
          Forgot Password?
        </Link>

        <Button type="submit" variant="brand" size="xl" disabled={submitting}>
          {submitting ? "Logging in…" : "Login"}
        </Button>
      </form>
    </AuthLayout>
  );
}
