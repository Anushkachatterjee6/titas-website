import { FaWhatsapp } from "react-icons/fa";
import { whatsappHref } from "@/data/company";

/** Fixed WhatsApp contact button — the left-side counterpart to the
 *  "Chat with TiTAS" assistant button on the right (see ChatWidget.tsx).
 *  Always rendered, independent of the assistant's open/closed state, so it
 *  never overlaps or interferes with it. Uses the same existing approved
 *  WhatsApp business number as the rest of the site (`whatsappHref`). */
export function WhatsAppButton() {
  return (
    <div className="fixed bottom-5 left-5 z-40 flex items-center gap-2.5 sm:bottom-7 sm:left-7">
      <a
        href={whatsappHref}
        target="_blank"
        rel="noreferrer noopener"
        aria-label="Chat with TiTAS on WhatsApp"
        className="flex items-center gap-2.5"
      >
        <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white shadow-float transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1DA851]">
          <FaWhatsapp className="size-6" aria-hidden="true" />
        </span>
        <span className="hidden rounded-full border border-border bg-card/95 px-4 py-2.5 text-sm font-semibold whitespace-nowrap text-ink shadow-lift sm:inline">
          Chat on WhatsApp
        </span>
      </a>
    </div>
  );
}
