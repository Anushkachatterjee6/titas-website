import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { company } from "@/data/company";
import { cn } from "@/lib/utils";

/**
 * Icons are real vector brand marks (react-icons' Font Awesome set) in each
 * brand's official colour, not a screenshot or hand-drawn recreation:
 * - Facebook and LinkedIn: a flat circle/squircle filled with the brand's
 *   official colour as a plain CSS background, with the bare letter glyph
 *   (`FaFacebookF` / `FaLinkedinIn`) drawn in white on top. Earlier this used
 *   the combined circle+letter icon with the letter as a cut-out over a
 *   white backing layer — but those combined glyphs have built-in margin
 *   inside their viewBox, which showed up as an unwanted white ring/border
 *   around the badge. Using the bare letter on a flat colour shape avoids
 *   that entirely — no backing layer, no border.
 * - Instagram: `FaInstagram` is already line-art (camera + ring + dot as
 *   open shapes), so it's drawn in white directly on top of a gradient
 *   backing that matches Instagram's familiar brand gradient.
 */
const BRAND = {
  facebook: "#1877F2",
  linkedin: "#0A66C2",
} as const;

export function SocialLinks({
  className,
  tone = "default",
}: {
  className?: string;
  tone?: "default" | "inverse";
}) {
  const links = [
    { key: "facebook", label: "Facebook", url: company.social.facebookUrl },
    { key: "instagram", label: "Instagram", url: company.social.instagramUrl },
    { key: "linkedin", label: "LinkedIn", url: company.social.linkedinUrl },
  ] as const;

  // Both badge styles below are already full-colour brand marks that read
  // clearly on light or dark surfaces, so — unlike the previous monochrome
  // icons — `tone` no longer needs to swap icon colour. The prop is kept
  // for API stability since callers (Footer) still pass it.
  void tone;

  return (
    <ul className={cn("flex items-center gap-2.5", className)}>
      {links.map(({ key, label, url }) => (
        <li key={key}>
          {url ? (
            <a
              href={url}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={label}
              className="group block transition-transform duration-300 hover:-translate-y-0.5"
            >
              <SocialBadge brand={key} />
            </a>
          ) : (
            <span
              title={`${label} — official profile link awaited`}
              aria-label={label}
              className="block cursor-default opacity-50"
            >
              <SocialBadge brand={key} />
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

function SocialBadge({ brand }: { brand: "facebook" | "instagram" | "linkedin" }) {
  if (brand === "instagram") {
    return (
      <span
        className="flex size-9 items-center justify-center rounded-xl shadow-sm transition-shadow duration-300 group-hover:shadow-lift"
        style={{
          backgroundImage:
            "linear-gradient(135deg, #feda75 0%, #fa7e1e 25%, #d62976 50%, #962fbf 75%, #4f5bd5 100%)",
        }}
      >
        <FaInstagram className="size-[1.15rem] text-white" aria-hidden="true" />
      </span>
    );
  }

  const hex = BRAND[brand];
  const Icon = brand === "facebook" ? FaFacebookF : FaLinkedinIn;

  return (
    <span
      className={cn(
        "flex size-9 items-center justify-center shadow-sm transition-shadow duration-300 group-hover:shadow-lift",
        brand === "facebook" ? "rounded-full" : "rounded-xl",
      )}
      style={{ backgroundColor: hex }}
    >
      <Icon className="size-[0.95rem] text-white" aria-hidden="true" />
    </span>
  );
}
