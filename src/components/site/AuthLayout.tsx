import type { ReactNode } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Section } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { Droplets } from "@/components/site/WaterMotion";
import { Logo } from "@/components/site/Logo";

/** Shared shell for the auth pages (login/signup/forgot/reset password) —
 *  a single centred, spacious card, consistent with the rest of the site. */
export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main>
        <Section className="relative overflow-hidden py-16 md:py-24">
          <Droplets count={3} className="hidden lg:block" />
          <div className="relative mx-auto w-full max-w-md">
            <Reveal>
              <div className="text-center">
                <Logo className="justify-center" />
                <h1 className="mt-7 text-2xl font-semibold text-ink md:text-3xl">{title}</h1>
                {subtitle && (
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{subtitle}</p>
                )}
              </div>

              <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-lift md:p-8">
                {children}
              </div>

              {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
            </Reveal>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}

/** Shared field wrapper — matches the Contact page's form styling. */
export function AuthField({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
        {label}
      </label>
      {children}
    </div>
  );
}

/** Inline form-level error banner — used for auth failures. */
export function AuthError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="rounded-lg border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive"
    >
      {message}
    </p>
  );
}

/** Inline success banner — e.g. "we've sent a password reset link". */
export function AuthNotice({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p className="rounded-lg border border-aqua/30 bg-accent/60 px-3.5 py-2.5 text-sm text-ink">
      {message}
    </p>
  );
}
