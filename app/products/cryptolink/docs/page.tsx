// app/products/cryptolink/docs/page.tsx
import dynamic from "next/dynamic";
import { cryptolinkDocs } from "@/lib/cryptolink/docs";

export const metadata = {
  title: "CryptoLink · Docs | evi_link devs",
  description: "Documentación oficial de CryptoLink: REST, SSE, auth, límites y errores.",
};

const DocsRenderer = dynamic(() => import("@/components/cryptolink/DocsRenderer"), {
  ssr: false,
});

export default function CryptoLinkDocsPage() {
  return (
    <main className="page">
      <section className="section">
        <div className="container container-narrow">
          <DocsRenderer docs={cryptolinkDocs} />
        </div>
      </section>
    </main>
  );
}
