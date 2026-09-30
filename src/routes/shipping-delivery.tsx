import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";
import { getLegalDoc } from "@/data/legal";

const doc = getLegalDoc("shipping-delivery")!;
const title = `${doc.pageTitle} | TiTAS`;
const description =
  "TiTAS delivery areas, charges, timing and terms for packaged drinking water orders.";

export const Route = createFileRoute("/shipping-delivery")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <LegalPage doc={doc} />,
});
