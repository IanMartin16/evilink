// app/products/cryptolink/docs/page.tsx
import DocsRenderer from "@/components/cryptolink/DocsRenderer";
import { cryptolinkDocs } from "@/lib/cryptolink/docs";

export const metadata = {
  title: "CryptoLink · Docs | evi_link devs",
  description: "Documentación oficial de CryptoLink: REST, SSE, auth, límites y errores.",
};

export default function CryptoLinkDocsPage() {
  return (
    <main className="page">
      {/* tu header/nav igual */}

      <section className="section">
        <div className="container container-narrow">
          { <DocsRenderer docs={cryptolinkDocs} />}
        </div>
      </section>

      {/* footer igual */}
    </main>
  );
}
