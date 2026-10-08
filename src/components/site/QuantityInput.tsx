import { useEffect, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * [-] [typeable quantity] [+] control shared by the cart drawer and the
 * full cart page, so both stay on the exact same cart state/behaviour.
 *
 * The input keeps its own local draft string while typing (so a customer
 * can freely clear the field and type "100" without every keystroke
 * mutating the cart), and only commits — via the same `onChange` the +/-
 * buttons already use — on blur or Enter. Typing 0 and committing removes
 * the line, matching the existing -button-to-zero behaviour; an empty or
 * otherwise invalid value reverts to the last valid quantity instead of
 * silently removing the item.
 */
export function QuantityInput({
  qty,
  onChange,
  label,
  className,
}: {
  qty: number;
  onChange: (qty: number) => void;
  label: string;
  className?: string;
}) {
  const [draft, setDraft] = useState(String(qty));

  useEffect(() => {
    setDraft(String(qty));
  }, [qty]);

  const commit = (raw: string) => {
    if (raw.trim() === "") {
      setDraft(String(qty));
      return;
    }
    const parsed = Math.floor(Number(raw));
    if (!Number.isFinite(parsed) || parsed < 0) {
      setDraft(String(qty));
      return;
    }
    const clamped = Math.min(999, parsed);
    setDraft(String(clamped));
    if (clamped !== qty) onChange(clamped);
  };

  return (
    <div className={cn("flex items-center rounded-md border border-border", className)}>
      <button
        type="button"
        onClick={() => onChange(qty - 1)}
        aria-label={`Decrease ${label} quantity`}
        className="flex size-8 shrink-0 items-center justify-center text-ink transition-colors hover:bg-accent"
      >
        <Minus className="size-3" aria-hidden="true" />
      </button>
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={draft}
        aria-label={`${label} quantity`}
        onChange={(e) => setDraft(e.target.value.replace(/[^0-9]/g, ""))}
        onBlur={(e) => commit(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commit(e.currentTarget.value);
            e.currentTarget.blur();
          }
        }}
        className="w-10 shrink-0 bg-transparent text-center text-sm font-medium text-ink focus:outline-none"
      />
      <button
        type="button"
        onClick={() => onChange(Math.min(999, qty + 1))}
        aria-label={`Increase ${label} quantity`}
        className="flex size-8 shrink-0 items-center justify-center text-ink transition-colors hover:bg-accent"
      >
        <Plus className="size-3" aria-hidden="true" />
      </button>
    </div>
  );
}
