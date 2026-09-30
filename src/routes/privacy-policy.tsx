import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";
import { getLegalDoc } from "@/data/legal";

const doc = getLegalDoc("privacy-policy")!;
const title = `${doc.pageTitle} | TiTAS`;
const description =
  "How SUJIT AQUA ENTERPRISE (TiTAS) collects, uses and protects information provided through the TiTAS website.";

export const Route = createFileRoute("/privacy-policy")({
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
