import { useEffect, useRef, useState } from "react";
import { Droplet, Send, X } from "lucide-react";
import { sendChatMessage, CHAT_MAX_MESSAGE_LENGTH, type ChatTurn } from "@/lib/chat";
import { getScreenContent, type Screen, type ScreenButton } from "@/lib/chatWorkflows";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/data/products";
import { products } from "@/data/products";
import { cn } from "@/lib/utils";

type Message = ChatTurn & { id: string; error?: boolean; buttons?: ScreenButton[] };

/** `crypto.randomUUID` needs a secure context and isn't guaranteed in every
 *  mobile webview — a throw here would silently kill the click/submit
 *  handler before any message ever rendered. This never throws. */
let idCounter = 0;
function makeId(): string {
  idCounter += 1;
  return `msg-${Date.now()}-${idCounter}`;
}

const MAIN_SCREEN: Screen = { id: "main" };

function welcomeMessage(): Message {
  const main = getScreenContent(MAIN_SCREEN);
  return {
    id: "welcome",
    role: "model",
    text: "Hi! I'm TiTAS Assistant 💧\nHow can I help you?",
    buttons: main.buttons,
  };
}

/** Premium floating TiTAS Assistant — a water-inspired chat panel, open to
 *  every visitor regardless of login state. Deterministic guided workflows
 *  (see src/lib/chatWorkflows.ts) handle the quick-action buttons without
 *  any Gemini call; free-typed questions still go through the existing
 *  Gemini-backed Edge Function exactly as before — it's informational only
 *  and never touches account/order data either way. */
export function ChatWidget() {
  const cart = useCart();

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([welcomeMessage()]);
  const [screen, setScreen] = useState<Screen>(MAIN_SCREEN);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [freeTextMode, setFreeTextMode] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  const handleToggle = () => {
    setOpen((v) => !v);
  };

  // --- Free-text (existing Gemini flow) — unchanged behaviour ---------------
  const submitMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    const userMsg: Message = { id: makeId(), role: "user", text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSending(true);

    try {
      const history: ChatTurn[] = [...messages, userMsg]
        .filter((m) => m.id !== "welcome")
        .map(({ role, text: t }) => ({ role, text: t }));

      const { reply, error } = await sendChatMessage(trimmed, history);

      setMessages((prev) => [
        ...prev,
        error
          ? { id: makeId(), role: "model", text: error, error: true }
          : { id: makeId(), role: "model", text: reply! },
      ]);
    } catch (err) {
      console.error("TiTAS Assistant: failed to send message", err);
      setMessages((prev) => [
        ...prev,
        {
          id: makeId(),
          role: "model",
          text: "I'm having trouble connecting right now. Please try again in a moment.",
          error: true,
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  // --- Guided workflow buttons — deterministic, no network call -------------
  const handleButton = (button: ScreenButton) => {
    // Echo the chosen option as a user message, as if they'd typed it.
    setMessages((prev) => [...prev, { id: makeId(), role: "user", text: button.label }]);
    setFreeTextMode(false);

    if (button.special === "free-chat") {
      setMessages((prev) => [
        ...prev,
        {
          id: makeId(),
          role: "model",
          text: "Sure — type your question below and I'll do my best to help!",
        },
      ]);
      setFreeTextMode(true);
      setScreen(button.screen);
      return;
    }

    if (button.special === "add-to-cart" && screen.id === "order-confirm") {
      const product = products.find((p) => p.slug === screen.slug);
      cart.add(screen.slug, screen.qty);
      const nextContent = getScreenContent(button.screen);
      setMessages((prev) => [
        ...prev,
        {
          id: makeId(),
          role: "model",
          text: product
            ? `Added ${screen.qty} × ${product.name} to your cart (${formatPrice(product.pricePerUnit * screen.qty)}). You can review it any time from the cart icon, or continue below.`
            : "Added to your cart.",
          buttons: nextContent.buttons,
        },
      ]);
      setScreen(button.screen);
      return;
    }

    const content = getScreenContent(button.screen);
    setMessages((prev) => [
      ...prev,
      { id: makeId(), role: "model", text: content.text, buttons: content.buttons },
    ]);
    setScreen(button.screen);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMessage(input);
  };

  return (
    <>
      {/* Floating trigger row — a "Chat with TiTAS" pill beside the assistant
          button, both wired to the same handleToggle. Hidden while the panel
          is open so it never appears inside/behind the chat window. */}
      {!open && (
        <div className="fixed right-5 bottom-5 z-40 flex items-center gap-2.5 sm:right-7 sm:bottom-7">
          <button
            type="button"
            onClick={handleToggle}
            aria-label="Chat with TiTAS"
            className="animate-in fade-in slide-in-from-right-1 rounded-full border border-border bg-card/95 px-4 py-2.5 text-sm font-semibold whitespace-nowrap text-ink shadow-lift transition-transform duration-200 hover:-translate-y-0.5"
          >
            <span className="hidden sm:inline">Chat with TiTAS</span>
            <span className="sm:hidden">Chat with us</span>
          </button>

          <button
            type="button"
            onClick={handleToggle}
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

      {/* Close trigger — replaces the row above while the panel is open. */}
      {open && (
        <button
          type="button"
          onClick={handleToggle}
          aria-label="Close TiTAS Assistant"
          className="fixed right-5 bottom-5 z-40 flex size-14 rotate-90 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-float transition-all duration-300 hover:-translate-y-0.5 hover:bg-ink sm:right-7 sm:bottom-7"
        >
          <X className="size-5" aria-hidden="true" />
        </button>
      )}

      {/* Panel */}
      {open && (
        <div
          role="dialog"
          aria-label="TiTAS Assistant"
          className="fixed inset-x-4 bottom-24 z-[55] flex max-h-[32rem] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-float sm:inset-x-auto sm:right-7 sm:bottom-24 sm:w-96"
        >
          {/* Header */}
          <div className="relative flex items-center gap-3 overflow-hidden bg-primary px-5 py-4 text-primary-foreground">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-6 -right-6 size-24 rounded-full bg-aqua/25 blur-2xl"
            />
            <span className="flex size-9 items-center justify-center rounded-full bg-ink-foreground/15">
              <Droplet className="size-4.5" aria-hidden="true" />
            </span>
            <div className="relative">
              <p className="text-sm font-semibold">TiTAS Assistant</p>
              <p className="text-[0.7rem] text-primary-foreground/70">Ekti Jaler Naam</p>
            </div>
          </div>

          {/* Messages */}
          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto bg-background px-4 py-4">
            {messages.map((m) => (
              <div key={m.id} className={cn("flex flex-col", m.role === "user" ? "items-end" : "items-start")}>
                <p
                  className={cn(
                    "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-line",
                    m.role === "user"
                      ? "rounded-br-sm bg-primary text-primary-foreground"
                      : m.error
                        ? "rounded-bl-sm border border-destructive/30 bg-destructive/10 text-destructive"
                        : "rounded-bl-sm border border-border bg-card text-ink",
                  )}
                >
                  {m.text}
                </p>
                {m.buttons && m.buttons.length > 0 && (
                  <div className="mt-2 flex max-w-[95%] flex-wrap gap-1.5">
                    {m.buttons.map((b, i) => (
                      <button
                        key={`${m.id}-${i}-${b.label}`}
                        type="button"
                        onClick={() => handleButton(b)}
                        className="rounded-full border border-aqua/40 bg-accent/60 px-2.5 py-1 text-[0.7rem] font-medium text-primary transition-colors hover:bg-accent"
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <span className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-border bg-card px-3.5 py-2.5">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="size-1.5 animate-bounce rounded-full bg-aqua"
                      style={{ animationDelay: `${i * 120}ms` }}
                    />
                  ))}
                </span>
              </div>
            )}
          </div>

          {/* Input */}
          <form className="flex items-center gap-2 border-t border-border bg-card p-3" onSubmit={handleFormSubmit}>
            <input
              type="text"
              value={input}
              maxLength={CHAT_MAX_MESSAGE_LENGTH}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submitMessage(input);
                }
              }}
              placeholder={freeTextMode ? "Type your question…" : "Ask about products, delivery, orders…"}
              className="h-10 flex-1 rounded-full border border-border bg-background px-4 text-sm text-ink placeholder:text-muted-foreground focus:border-aqua focus:outline-none"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              aria-label="Send message"
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-ink disabled:opacity-40"
            >
              <Send className="size-4" aria-hidden="true" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
