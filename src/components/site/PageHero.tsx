import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";
import { Reveal } from "./Reveal";

export function PageHero({
  eyebrow,
  title,
  script,
  lede,
  crumbs,
  children,
}: {
  eyebrow?: string;
  title: string;
  script?: string;
  lede?: string;
  crumbs: Crumb[];
  children?: ReactNode;
}) {
  return (
    <header className="surface-deep relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -right-24 size-[34rem] rounded-full bg-aqua/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-52 -left-32 size-[30rem] rounded-full bg-aqua-soft/10 blur-3xl"
      />
      <div className="container-page relative">
        <Breadcrumbs items={crumbs} tone="inverse" />
        <Reveal className="mt-7 max-w-3xl">
          {eyebrow && <p className="eyebrow mb-4 text-aqua-soft/80">{eyebrow}</p>}
          <h1 className="text-4xl leading-[1.04] font-semibold text-ink-foreground md:text-[3.4rem]">
            {title}
            {script && (
              <>
                {" "}
                <span className="script-accent font-normal text-aqua-soft">
                  {script}
                </span>
              </>
            )}
          </h1>
          {lede && (
            <p className="mt-6 max-w-2xl text-[1.05rem] leading-relaxed text-ink-foreground/75">
              {lede}
            </p>
          )}
          {children && <div className="mt-9">{children}</div>}
        </Reveal>
      </div>
    </header>
  );
}
