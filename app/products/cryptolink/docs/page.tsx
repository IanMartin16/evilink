// app/products/cryptolink/docs/page.tsx
import DocsClient from "./DocsClient";

export const metadata = {
  title: "CryptoLink · Docs | evi_link devs",
  description: "Documentación oficial de CryptoLink: REST, SSE, auth, límites y errores.",
};

export default function CryptoLinkDocsPage() {
  return (
    <main className="page">
      <section className="section">
        <div className="container container-narrow">
          <DocsClient />
        </div>
      </section>
    </main>
  );
}
