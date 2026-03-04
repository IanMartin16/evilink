export type EstadoProducto = "LIVE" | "PLATFORM" | "COMING SOON";

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
    estado: "LIVE",
    desc: "Precios cripto + streaming SSE, límites por plan, API keys y checkout con Stripe.",
    bullets: [
      "SSE en tiempo real (price / ping)",
      "Rate-limit por plan (X-RateLimit-*)",
      "SDK JS + docs oficiales",
    ],
    tag: "Railway · Stripe · Resend · Postgres",
    links: [
      { label: "Go Cryptolink.mx →", href: "https://cryptolink.mx/dashboard", external: true },
      { label: "Docs →", href: "https://cryptolink.mx/docs", external: true },
    ],
    destacado: true,
  },
  {
    key: "curpify",
    nombre: "Curpify API",
    estado: "PLATFORM",
    desc: "Validación de CURP lista para producción, integración sencilla vía HTTP.",
    bullets: ["Validación rápida y consistente", "Respuestas JSON", "Integración vía HTTP"],
    tag: "Next.js · Postgres · Stripe",
    links: [{ label: "Ver producto →", href: "https://curpify.com", external: true }],
    destacado: true,
  },
  {
    key: "nexus",
    nombre: "Nexus",
    estado: "COMING SOON",
    desc: "Integraciones y automatización: datos públicos, notificaciones, deportes y workflows.",
    bullets: ["Connectors", "Alerts / Notificaciones", "Jobs y automatizaciones"],
    tag: "Roadmap en construcción",
    links: [
      { label: "Roadmap", href: "/productos#roadmap" },
      { label: "Join waitlist", href: "mailto:support@evilink.dev?subject=Nexus%20waitlist", external: true },
    ],
    destacado: true,
  },
  {
    key: "social_link",
    nombre: "Social_Link",
    tag: "Real-time sentiment and trends from social platforms",
    desc:
    "Analyze sentiment, detect trends, and enrich your applications with real-time social intelligence. Designed for developers building market analytics, trading tools, and AI agents.",
    estado: "COMING SOON",
    links: [{label: "coming_soon...", href: "/productos#roadmap"}],
    bullets: [
      "Social sentiment analysis",
      "Trending assets detection",
      "Developer-first REST API",
      "Real-time signals for AI agents"
  ],
  destacado: true,
},
];

