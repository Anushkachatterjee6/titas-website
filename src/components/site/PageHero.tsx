import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";
import { ScriptAccent } from "./TiTASWordmark";
import { cn } from "@/lib/utils";
import pageSurfaceImg from "@/assets/titas/motion/page-surface-water-blue-v2.png";
import type { HeroImage } from "@/data/heroImages";

export function PageHero({
  eyebrow,
  eyebrowClassName,
  title,
  script,
  lede,
  crumbs,
  children,
  image,
}: {
  eyebrow?: string;
  /** Extra classes merged onto the eyebrow — for the rare hero that needs a
   *  more prominent eyebrow than the shared default. */
  eyebrowClassName?: string;
  /** Usually a plain string; accepts ReactNode for the rare heading that
   *  needs to mix in something like the TiTAS wordmark inline (see the
   *  Dealer/Distributor page). */
  title: ReactNode;
  script?: string;
  lede?: string;
  crumbs: Crumb[];
  children?: ReactNode;
  /** Optional decorative 3D bottle render for the hero's right side — see
   *  src/data/heroImages.ts for the page→image mapping. Omitted on
   *  functional/form-heavy pages that don't use PageHero at all. */
  image?: HeroImage;
}) {
  return (
    <header
      className="relative flex min-h-[350px] flex-col justify-center overflow-hidden bg-cover bg-top bg-no-repeat pt-12 pb-8 text-ink-foreground md:min-h-[410px] md:pt-14 md:pb-10 lg:min-h-[460px] lg:pt-16 lg:pb-12"
      style={{ backgroundImage: `url(${pageSurfaceImg})` }}
    >
      <div className="container-page relative">
        <Breadcrumbs items={crumbs} tone="inverse" />
        <div
          className={cn(
            "flex flex-col gap-5 sm:gap-6",
            image && "md:flex-row md:items-center md:justify-between md:gap-8",
          )}
        >
          <div className={cn("mt-5 max-w-4xl", image && "md:mt-5 md:max-w-xl md:shrink")}>
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
          </div>
          {image && (
            <div
              aria-hidden="true"
              className="mx-auto hidden w-60 shrink-0 sm:block md:mx-0 md:h-[260px] md:w-[44%] lg:h-[330px] lg:w-[42%] xl:h-[360px] xl:w-[46%]"
            >
              <img
                src={image.src}
                alt=""
                className="h-auto max-h-full w-full object-contain drop-shadow-[0_16px_22px_rgba(10,40,70,0.22)]"
                draggable={false}
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
