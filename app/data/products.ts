export type EstadoProducto = "DISPONIBLE" | "LANZAMIENTO" | "EN DESARROLLO";

export type Producto = {
  key: string;
  nombre: string;
  estado: EstadoProducto;
  desc: string;
  bullets: string[];
  tag?: string;
  links: { label: string; href: string; external?: boolean }[];
  destacado?: boolean; // para Home
};

export const PRODUCTOS: Producto[] = [
  {
    key: "cryptolink",
    nombre: "CryptoLink API",
    estado: "DISPONIBLE",
    desc: "Precios cripto + streaming SSE, límites por plan, API keys y checkout con Stripe.",
    bullets: [
      "SSE en tiempo real (price / ping)",
      "Rate-limit por plan (X-RateLimit-*)",
      "Stripe webhooks → email + DB",
    ],
    tag: "Railway · Stripe · Resend · Postgres",
    links: [{ label: "Landing + Docs →", href: "/products/cryptolink" }],
    destacado: true,
  },
  {
    key: "curpify",
    nombre: "Curpify API",
    estado: "LANZAMIENTO",
    desc: "Validación de CURP lista para producción, integración sencilla vía HTTP.",
    bullets: ["Validación rápida y consistente", "Respuestas JSON", "Integración vía HTTP"],
    tag: "Next.js · Postgres · Stripe",
    links: [{ label: "Ver producto →", href: "https://curpify.com", external: true }],
    destacado: true,
  },
  {
    key: "nexus",
    nombre: "Nexus",
    estado: "EN DESARROLLO",
    desc: "Integraciones y automatización: datos públicos, notificaciones, deportes y workflows.",
    bullets: ["Connectors", "Alerts / Notificaciones", "Jobs y automatizaciones"],
    tag: "Roadmap en construcción",
    links: [
      { label: "Roadmap", href: "/productos#roadmap" },
      { label: "Join waitlist", href: "mailto:support@evilink.dev?subject=Nexus%20waitlist", external: true },
    ],
    destacado: true,
  },
];

