import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";
import { getLegalDoc } from "@/data/legal";

const doc = getLegalDoc("terms")!;
const title = `${doc.pageTitle} | TiTAS`;
const description =
  "Terms and conditions for using the TiTAS website, placing orders and purchasing packaged drinking water from SUJIT AQUA ENTERPRISE.";

export const Route = createFileRoute("/terms")({
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
