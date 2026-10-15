import { lazy, Suspense, useState } from "react";
import { Droplet, X } from "lucide-react";

// The full chat panel — ChatWidget.tsx itself plus its chatWorkflows/chat/
// cart/products dependencies — is only fetched, parsed and executed once a
// visitor actually opens the chat, instead of on every page load regardless
// of use. This component is the cheap, always-loaded half: just the
// floating trigger/close buttons and the `open` flag, in the main bundle so
// they appear immediately like before.
const ChatWidget = lazy(() => import("./ChatWidget"));

/** Floating TiTAS Assistant launcher — open to every visitor regardless of
 *  login state. Renders the same trigger pill + droplet button (closed) or
 *  close button (open) that ChatWidget itself used to render directly; see
 *  TiTAS mobile-performance investigation for why the split exists.
 *
 *  `hasOpened` (not just `open`) gates mounting the lazy panel: once a
 *  visitor opens the chat for the first time, the panel component stays
 *  mounted for the rest of the page's lifetime and `open` only toggles its
 *  visibility — this preserves the conversation (`messages`/`screen` state
 *  inside ChatWidget) across a close and reopen, exactly like the original
 *  single-component version did, instead of losing it on every close. */
export function ChatLauncher() {
  const [open, setOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

  const handleOpen = () => {
    setOpen(true);
    setHasOpened(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {/* Floating trigger row — a "Chat with TiTAS" pill beside the assistant
          button, both wired to the same handleOpen. Hidden while the panel
          is open so it never appears inside/behind the chat window. */}
      {!open && (
        <div className="fixed right-5 bottom-5 z-40 flex items-center gap-2.5 sm:right-7 sm:bottom-7">
          <button
            type="button"
            onClick={handleOpen}
            aria-label="Chat with TiTAS"
            className="animate-in fade-in slide-in-from-right-1 rounded-full border border-border bg-card/95 px-4 py-2.5 text-sm font-semibold whitespace-nowrap text-ink shadow-lift transition-transform duration-200 hover:-translate-y-0.5"
          >
            <span className="hidden sm:inline">Chat with TiTAS</span>
            <span className="sm:hidden">Chat with us</span>
          </button>

          <button
            type="button"
            onClick={handleOpen}
            aria-label="Open TiTAS Assistant"
            className="relative flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-float transition-all duration-300 hover:-translate-y-0.5 hover:bg-ink"
          >
            <span
              aria-hidden="true"
              className="animate-ripple absolute inset-0 rounded-full border border-aqua/50"
            />
            <Droplet className="size-6" aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Close trigger — replaces the row above while the panel is open.
          Rendered unconditionally here (not inside the Suspense boundary
          below), so it appears the instant the visitor clicks to open,
          even during the brief first-load fetch of ChatWidget's code —
          the floating button never disappears from this corner. */}
      {open && (
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close TiTAS Assistant"
          className="fixed right-5 bottom-5 z-40 flex size-14 rotate-90 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-float transition-all duration-300 hover:-translate-y-0.5 hover:bg-ink sm:right-7 sm:bottom-7"
        >
          <X className="size-5" aria-hidden="true" />
        </button>
      )}

      {/* The panel itself is `fixed`-positioned and doesn't participate in
          page layout flow, so a `null` Suspense fallback here causes no
          layout shift — there's simply nothing in that position until the
          panel streams in, while the close button above is already
          visible. */}
      {hasOpened && (
        <Suspense fallback={null}>
          <ChatWidget open={open} />
        </Suspense>
      )}
    </>
  );
}
