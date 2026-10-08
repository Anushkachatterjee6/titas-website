import { products, formatPrice, type Product } from "@/data/products";
import { services } from "@/data/services";
import { faqs } from "@/data/faqs";
import { company, telHref, whatsappHref } from "@/data/company";

/**
 * Deterministic TiTAS Assistant conversation content — no Gemini call, no
 * network request. Every string here is built only from data already
 * approved elsewhere in the project (`src/data/*.ts`); nothing is invented.
 */

export type Screen =
  | { id: "main" }
  | { id: "products" }
  | { id: "product"; slug: string }
  | { id: "order-qty"; slug: string }
  | { id: "order-confirm"; slug: string; qty: number }
  | { id: "delivery" }
  | { id: "delivery-topic"; topic: string }
  | { id: "payment" }
  | { id: "payment-topic"; topic: string }
  | { id: "faq" }
  | { id: "faq-topic"; question: string }
  | { id: "dealer" }
  | { id: "dealer-topic"; topic: string }
  | { id: "contact" }
  | { id: "contact-topic"; topic: string };

export type ScreenButton = {
  label: string;
  screen: Screen;
  /** Handled specially by the widget before/instead of navigating (e.g.
   *  adds to the existing cart, or hands off to the free-text Gemini chat). */
  special?: "add-to-cart" | "free-chat";
};
export type ScreenContent = { text: string; buttons: ScreenButton[] };

const MAIN_MENU: ScreenButton[] = [
  { label: "🛒 Place a New Order", screen: { id: "products" } },
  { label: "💧 Products & Prices", screen: { id: "products" } },
  { label: "🚚 Delivery & Service", screen: { id: "delivery" } },
  { label: "💳 Payment Information", screen: { id: "payment" } },
  { label: "❓ FAQs", screen: { id: "faq" } },
  { label: "🤝 Dealer / Distributor", screen: { id: "dealer" } },
  { label: "📞 Contact TiTAS", screen: { id: "contact" } },
];

const BACK_BUTTONS = (parent: Screen): ScreenButton[] => [
  { label: "⬅ Back", screen: parent },
  { label: "🏠 Main Menu", screen: { id: "main" } },
];

function findFaq(match: string) {
  return faqs.find((f) => f.question.toLowerCase().includes(match.toLowerCase()));
}

function productBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getScreenContent(screen: Screen): ScreenContent {
  switch (screen.id) {
    case "main":
      return {
        text: "What would you like help with?",
        buttons: [
          ...MAIN_MENU,
          { label: "💬 Other Questions", screen: { id: "main" }, special: "free-chat" },
        ],
      };

    case "products":
      return {
        text: "Here's the full TiTAS range — tap a pack size for details and pricing.",
        buttons: [
          ...products.map((p) => ({ label: p.name, screen: { id: "product", slug: p.slug } as Screen })),
          { label: "🏠 Main Menu", screen: { id: "main" } },
        ],
      };

    case "product": {
      const product = productBySlug(screen.slug);
      if (!product) return getScreenContent({ id: "products" });
      return {
        text: `${product.name} — ${product.headline}\n${product.description}\n\nPrice: ${formatPrice(product.pricePerUnit)} per ${product.priceUnit}`,
        buttons: [
          { label: "Order this product", screen: { id: "order-qty", slug: product.slug } },
          { label: "View all products", screen: { id: "products" } },
          { label: "🏠 Main Menu", screen: { id: "main" } },
        ],
      };
    }

    case "order-qty": {
      const product = productBySlug(screen.slug);
      if (!product) return getScreenContent({ id: "products" });
      return {
        text: `How many ${product.priceUnit.startsWith("case") ? "cases" : "units"} of ${product.name} would you like?`,
        buttons: [1, 2, 3, 5, 10].map((qty) => ({
          label: String(qty),
          screen: { id: "order-confirm", slug: product.slug, qty },
        })),
      };
    }

    case "order-confirm": {
      const product = productBySlug(screen.slug);
      if (!product) return getScreenContent({ id: "products" });
      const total = product.pricePerUnit * screen.qty;
      return {
        text: `Confirm: ${screen.qty} × ${product.name} (${formatPrice(product.pricePerUnit)} per ${product.priceUnit}) = ${formatPrice(total)}.\n\nThis won't place the order yet — it adds it to your cart, and you'll complete checkout on the website.`,
        buttons: [
          { label: "Add to Cart", screen: { id: "main" }, special: "add-to-cart" },
          { label: "Change quantity", screen: { id: "order-qty", slug: product.slug } },
          { label: "🏠 Main Menu", screen: { id: "main" } },
        ],
      };
    }

    case "delivery":
      return {
        text: "What would you like to know about delivery?",
        buttons: [
          { label: "Delivery Areas", screen: { id: "delivery-topic", topic: "areas" } },
          { label: "Delivery Charges", screen: { id: "delivery-topic", topic: "charges" } },
          { label: "Bulk Orders", screen: { id: "delivery-topic", topic: "bulk" } },
          { label: "Regular Supply", screen: { id: "delivery-topic", topic: "regular" } },
          { label: "Home Delivery", screen: { id: "delivery-topic", topic: "home" } },
          { label: "Business / Institutional Supply", screen: { id: "delivery-topic", topic: "business" } },
          ...BACK_BUTTONS({ id: "main" }),
        ],
      };

    case "delivery-topic": {
      const texts: Record<string, string> = {
        areas: company.delivery.reach,
        charges: company.delivery.freeDelivery,
        bulk: company.delivery.bulkMinimum,
        regular:
          findFaq("regular water supply")?.answer ||
          "Regular and scheduled supply can be arranged — please contact our team.",
        home: `${company.delivery.summary} ${services.find((s) => s.slug === "home-residential")?.description ?? ""}`,
        business: `${services.find((s) => s.slug === "office-commercial")?.description ?? ""} ${services.find((s) => s.slug === "institutional")?.description ?? ""}`,
      };
      return {
        text: texts[screen.topic] || "Please contact our team for details.",
        buttons: BACK_BUTTONS({ id: "delivery" }),
      };
    }

    case "payment": {
      return {
        text: "Which payment method would you like to know about?",
        buttons: (
          ["UPI", "Cards", "Net Banking", "Wallets", "Payment Link", "Bulk Order Payment", "Cash on Delivery"] as const
        )
          .map((label): ScreenButton => ({ label, screen: { id: "payment-topic", topic: label } }))
          .concat([{ label: "🏠 Main Menu", screen: { id: "main" } }]),
      };
    }

    case "payment-topic": {
      const paymentAnswer =
        findFaq("how can customers pay")?.answer ||
        "TiTAS accepts UPI, cards, net banking, wallets, payment links, bank transfer for eligible bulk orders, and cash on delivery where available.";
      const bulk =
        screen.topic === "Bulk Order Payment"
          ? " For bulk/business orders, bank transfer is also available for eligible orders."
          : "";
      return {
        text: `Yes — ${screen.topic} is one of TiTAS's accepted payment options.${bulk}\n\n${paymentAnswer}`,
        buttons: BACK_BUTTONS({ id: "payment" }),
      };
    }

    case "faq":
      return {
        text: "Pick a topic:",
        buttons: [
          "What products does TiTAS offer",
          "Where does TiTAS provide delivery",
          "minimum order quantity",
          "How can customers pay",
          "Do you accept bulk orders",
          "regular water supply",
          "become a TiTAS dealer",
          "How can customers contact",
        ]
          .map((key) => findFaq(key))
          .filter((f): f is NonNullable<typeof f> => !!f)
          .map((f) => ({ label: f.question, screen: { id: "faq-topic", question: f.question } as Screen }))
          .concat([{ label: "🏠 Main Menu", screen: { id: "main" } }]),
      };

    case "faq-topic": {
      const faq = faqs.find((f) => f.question === screen.question);
      return {
        text: faq?.answer || "Please check our FAQs page or contact us for this.",
        buttons: BACK_BUTTONS({ id: "faq" }),
      };
    }

    case "dealer": {
      const dealerService = services.find((s) => s.slug === "distributor-dealer");
      return {
        text: `${dealerService?.description ?? ""}\n\nWhat would you like to do?`,
        buttons: [
          { label: "Become a Dealer", screen: { id: "dealer-topic", topic: "dealer" } },
          { label: "Become a Distributor", screen: { id: "dealer-topic", topic: "distributor" } },
          { label: "Business Enquiry", screen: { id: "dealer-topic", topic: "enquiry" } },
          { label: "Contact TiTAS", screen: { id: "contact" } },
          { label: "🏠 Main Menu", screen: { id: "main" } },
        ],
      };
    }

    case "dealer-topic": {
      const faqAnswer =
        findFaq("become a titas dealer")?.answer ||
        "TiTAS welcomes enquiries from interested dealers, distributors, wholesalers and retailers.";
      return {
        text: `${faqAnswer}\n\nPlease share your business details and location on our Dealer / Distributor page, and our team will get in touch to discuss opportunities.`,
        buttons: BACK_BUTTONS({ id: "dealer" }),
      };
    }

    case "contact":
      return {
        text: "How would you like to reach TiTAS?",
        buttons: [
          { label: "Call TiTAS", screen: { id: "contact-topic", topic: "call" } },
          { label: "WhatsApp", screen: { id: "contact-topic", topic: "whatsapp" } },
          { label: "Find Us", screen: { id: "contact-topic", topic: "map" } },
          { label: "Business Hours", screen: { id: "contact-topic", topic: "hours" } },
          { label: "🏠 Main Menu", screen: { id: "main" } },
        ],
      };

    case "contact-topic": {
      const texts: Record<string, string> = {
        call: `Call us at **+91 ${company.phone}** (${telHref}).`,
        whatsapp: `Message us on **WhatsApp** at **+91 ${company.whatsapp}** (${whatsappHref}).`,
        map: company.locations
          .map((l) => `${l.label}: ${l.lines.join(", ")}`)
          .join("\n"),
        hours: `${company.hours.weekdays}. ${company.hours.closed}.`,
      };
      return {
        text: texts[screen.topic] || "Please visit our Contact page.",
        buttons: BACK_BUTTONS({ id: "contact" }),
      };
    }

    default:
      return getScreenContent({ id: "main" });
  }
}
