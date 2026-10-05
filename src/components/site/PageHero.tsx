import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";
import { Reveal } from "./Reveal";
import { ScriptAccent } from "./TiTASWordmark";
import { cn } from "@/lib/utils";
import pageSurfaceImg from "@/assets/titas/motion/page-surface-water-blue-v2.png";

export function PageHero({
  eyebrow,
  eyebrowClassName,
  title,
  script,
  lede,
  crumbs,
  children,
}: {
  eyebrow?: string;
  /** Extra classes merged onto the eyebrow — for the rare hero that needs a
   *  more prominent eyebrow than the shared default. */
  eyebrowClassName?: string;
  title: string;
  script?: string;
  lede?: string;
  crumbs: Crumb[];
  children?: ReactNode;
}) {
  return (
    <header
      className="relative overflow-hidden bg-cover bg-top bg-no-repeat pt-28 pb-16 text-ink-foreground md:pt-36 md:pb-24"
      style={{ backgroundImage: `url(${pageSurfaceImg})` }}
    >
      <div className="container-page relative">
        <Breadcrumbs items={crumbs} tone="inverse" />
        <Reveal className="mt-7 max-w-4xl">
          {eyebrow && (
            <p className={cn("eyebrow mb-4 text-aqua-soft/80", eyebrowClassName)}>{eyebrow}</p>
          )}
          <h1 className="text-[2.75rem] leading-[1.04] font-bold text-ink-foreground md:text-[3.9rem]">
            {title}
            {script && (
              <>
                {" "}
                <ScriptAccent text={script} className="font-normal text-aqua-soft" />
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
