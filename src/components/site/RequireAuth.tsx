import { useEffect, useRef, type ReactNode } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Section } from "@/components/site/Section";

/**
 * Client-side route guard: while the initial Supabase session restore is in
 * flight it shows a loading state (never a flash of logged-out content or a
 * premature redirect). Once resolved, an unauthenticated visitor is sent to
 * /login with `?redirect=<this route>` so they land back here after signing
 * in; their cart (localStorage-backed) is untouched by any of this.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  // Captured once, so navigating away (to /login) doesn't retrigger this
  // effect with the *new* pathname and redirect the user in a loop.
  const originalPathname = useRef(pathname);
  const redirected = useRef(false);

  useEffect(() => {
    if (loading || user || redirected.current) return;
    redirected.current = true;
    navigate({ to: "/login", search: { redirect: originalPathname.current }, replace: true });
  }, [loading, user, navigate]);

  if (loading || !user) {
    return (
      <>
        <Navbar />
        <main>
          <Section className="py-24">
            <div className="flex flex-col items-center justify-center gap-3 text-center">
              <span
                aria-hidden="true"
                className="size-8 animate-spin rounded-full border-2 border-aqua/30 border-t-primary"
              />
              <p className="text-sm text-muted-foreground">
                {loading ? "Checking your session…" : "Redirecting to login…"}
              </p>
            </div>
          </Section>
        </main>
        <Footer />
      </>
    );
  }

  return <>{children}</>;
}
