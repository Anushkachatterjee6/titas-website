import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { AuthLayout, AuthField, AuthError } from "@/components/site/AuthLayout";
import { GoogleIcon } from "@/components/site/SocialAuthIcons";
import { Facebook } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth, type OAuthProvider } from "@/lib/auth";

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
  const { signIn, signInWithOAuth } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<OAuthProvider | null>(null);

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

  const handleOAuth = async (provider: OAuthProvider) => {
    setError(null);
    setOauthLoading(provider);
    const { error: oauthError } = await signInWithOAuth(provider, redirect || "/account");
    // On success the browser is already navigating away to the provider's
    // consent screen, so this only ever resolves on the spot when something
    // went wrong before that redirect could happen.
    if (oauthError) {
      setError(oauthError);
      setOauthLoading(null);
    }
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
      <div className="grid gap-3">
        <AuthError message={error} />

        <Button
          type="button"
          variant="quiet"
          size="xl"
          disabled={oauthLoading !== null}
          onClick={() => handleOAuth("google")}
        >
          <GoogleIcon className="size-4.5" />
          {oauthLoading === "google" ? "Redirecting…" : "Continue with Google"}
        </Button>
        <Button
          type="button"
          variant="quiet"
          size="xl"
          disabled={oauthLoading !== null}
          onClick={() => handleOAuth("facebook")}
        >
          <Facebook className="size-4.5 fill-[#1877F2] text-[#1877F2]" aria-hidden="true" />
          {oauthLoading === "facebook" ? "Redirecting…" : "Continue with Facebook"}
        </Button>
      </div>

      <div className="my-6 flex items-center gap-3" aria-hidden="true">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Or</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <form className="grid gap-5" onSubmit={handleSubmit}>
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
