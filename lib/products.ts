export type Product = {
  slug: string;
  name: string;
  short: string;
  status: "live" | "beta" | "coming_soon";
  href: string;
  badge?: string;
};

export const products: Product[] = [
  {
    slug: "cryptolink",
    name: "CryptoLink",
    short: "Precios cripto + SSE en tiempo real con rate limit por plan.",
    status: "beta",
    href: "/products/cryptolink",
    badge: "API + SSE",
  },
  {
    slug: "curpify",
    name: "Curpify",
    short: "Validación de CURP (API) con planes y llaves por suscripción.",
    status: "beta",
    href: "/products/curpify",
    badge: "CURP API",
  },
  {
    slug: "data_link",
    name: "DataLink",
    short: "APIs de data y análisis (coming soon).",
    status: "coming_soon",
    href: "/products/data_link",
    badge: "Coming soon",
  },
];
