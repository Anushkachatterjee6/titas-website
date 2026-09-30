import { Facebook, Instagram, Linkedin } from "lucide-react";
import { company } from "@/data/company";
import { cn } from "@/lib/utils";

/**
 * Official social profiles have not been supplied yet, so the URLs in
 * `company.social` are intentionally empty. Icons render as inactive
 * placeholders until real URLs are added there.
 */
export function SocialLinks({
  className,
  tone = "default",
}: {
  className?: string;
  tone?: "default" | "inverse";
}) {
  const links = [
    { key: "facebook", label: "Facebook", Icon: Facebook, url: company.social.facebookUrl },
    { key: "instagram", label: "Instagram", Icon: Instagram, url: company.social.instagramUrl },
    { key: "linkedin", label: "LinkedIn", Icon: Linkedin, url: company.social.linkedinUrl },
  ];

  return (
    <ul className={cn("flex items-center gap-2.5", className)}>
      {links.map(({ key, label, Icon, url }) => {
        const base =
          "flex size-9 items-center justify-center rounded-full border transition-all duration-300";
        const idle =
          tone === "inverse"
            ? "border-ink-foreground/20 text-ink-foreground/55"
            : "border-border text-muted-foreground";
        const active =
          tone === "inverse"
            ? "hover:-translate-y-0.5 hover:border-aqua-soft hover:text-ink-foreground"
            : "hover:-translate-y-0.5 hover:border-aqua hover:text-primary";

        return (
          <li key={key}>
            {url ? (
              <a
                href={url}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`TiTAS on ${label}`}
                className={cn(base, idle, active)}
              >
                <Icon className="size-4" aria-hidden="true" />
              </a>
            ) : (
              <span
                title={`${label} — official profile link awaited`}
                aria-label={`${label} profile not published yet`}
                className={cn(base, idle, "cursor-default opacity-45")}
              >
                <Icon className="size-4" aria-hidden="true" />
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
