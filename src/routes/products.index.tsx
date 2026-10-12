import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { ProductGrid } from "@/components/site/ProductCard";
import { products } from "@/data/products";
import { heroImages } from "@/data/heroImages";

const title = "Products | TiTAS Packaged Drinking Water";
const description =
  "TiTAS packaged drinking water in 500 ml, 1 L, 2 L, 5 L and 20 L packs, for homes, businesses, institutions, events and bulk requirements.";

export const Route = createFileRoute("/products/")({
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
  component: ProductsPage,
});

function ProductsPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          eyebrow="Our Range"
          title="One trusted name,"
          script="five pack sizes"
          lede="From a bottle on the go to regular 20 L supply — choose the TiTAS pack that fits your need."
          crumbs={[{ label: "Products" }]}
          image={heroImages.products}
        />
        <Section>
          <ProductGrid items={products} />
        </Section>
      </main>
      <Footer />
    </>
  );
}
