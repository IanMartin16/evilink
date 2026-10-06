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
    desc: "La capa de inteligencia cripto de Evilink evoluciona sobre datos persistentes, ranking propio y señales derivadas para ofrecer una lectura de mercado más rica, consistente y explicable.",
    bullets: [
      "Overview construye un Top 100 propio con precio, 24h, 7d, volumen, market cap y sparkline",
      "Market Breadth y derivados propios fortalecen la capa de inteligencia de mercado",
      "La persistencia histórica prepara el camino para históricos más profundos y nuevos insights",
    ],
    tag: "market intelligence · own ranking · persistent data",
    links: [
      {
        label: "Go Cryptolink.mx →",
        href: "https://cryptolink.mx/dashboard",
        external: true,
      },
      {
        label: "Docs →",
        href: "https://cryptolink.mx/docs",
        external: true,
      },
    ],
    destacado: true,
  },
  {
    key: "social_link",
    nombre: "Social_Link",
    estado: "PLATFORM",
    desc: "La capa de señales y atención de Evilink evoluciona sobre datos históricos reales para enriquecer la lectura de mercado dentro de CryptoLink.",
    bullets: [
      "Market Attention mide atención sostenida y emergente por símbolo",
      "Attention Pulse convierte la actividad histórica en una lectura macro del mercado",
      "Su base de datos prepara la siguiente etapa de insights y análisis asistido por ML",
    ],
    tag: "market attention · historical signals · insights path",
    links: [{ label: "Roadmap →", href: "/#roadmap" }],
    destacado: true,
  },
  {
    key: "curpify",
    nombre: "Curpify API",
    estado: "LIVE",
    desc: "La API de validación de Evilink continúa consolidándose con validación más estricta, una interfaz alineada al ecosistema y una base lista para su siguiente análisis.",
    bullets: [
      "Valida CURP y RFC con dígito verificador",
      "Interfaz alineada al ecosistema Evilink",
      "Su siguiente evolución técnica y comercial queda en análisis",
    ],
    tag: "strict validation · Next.js · Postgres · Stripe",
    links: [
      { label: "Comprar →", href: "https://curpify.com/pricing", external: true },
    ],
    destacado: false,
  },
  {
    key: "nexus",
    nombre: "Nexus",
    estado: "PLATFORM",
    desc: "La capa de integración de Evilink evoluciona hacia una ruta más ligera, conectada con MCP-One y enfocada en coordinación guiada del ecosistema.",
    bullets: [
      "Knowledge-driven sobre docs y capacidades oficiales",
      "Integración con MCP-One ya operando dentro del ecosistema",
      "Ruta más ligera para coordinar sin concentrar responsabilidades excesivas",
    ],
    tag: "Nexus-slim · MCP-One · integration layer",
    links: [
      { label: "Roadmap →", href: "/#roadmap" },
    ],
    destacado: false,
  },
  {
    key: "secure_link",
    nombre: "Secure_Link",
    estado: "PLATFORM",
    desc: "La línea de seguridad de Evilink, enfocada en señales de riesgo, evaluación inteligente y protección para futuros módulos del ecosistema.",
    bullets: [
      "Motor de risk signals con avance técnico significativo",
      "Candidato serio para una próxima etapa en producción",
      "Su siguiente fase evaluará integraciones con nuevas capas de seguridad del ecosistema",
    ],
    tag: "risk signals · security line · candidate",
    links: [{ label: "Roadmap →", href: "/#roadmap" }],
    destacado: true,
  },
  {
    key: "data_link",
    nombre: "Data_Link",
    estado: "PLATFORM",
    desc: "La línea de datos de Evilink avanza hacia una etapa más sólida con dominio propio, nueva consola y una dirección clara para unir procesamiento y transformación.",
    bullets: [
      "data-link.dev queda como nueva base del producto",
      "Nueva consola preparada para alojar Core y Transform",
      "Checkout live integrado para suscripciones reales",
    ],
    tag: "data-link.dev · Core · Transform path",
    links: [
      { label: "Visit website →", href: "https://data-link.dev", external: true },
      { label: "Roadmap →", href: "/#roadmap" },
    ],
    destacado: true,
  },
  {
    key: "vsecrets",
    nombre: "V-Secrets",
    estado: "PLATFORM",
    desc: "La capa de gestión segura de secretos de Evilink avanza hacia una experiencia más profesional, enfocada en cifrado, control, versionado y acceso programático.",
    bullets: [
      "Website renovado con landing informativa antes del acceso",
      "Checkout live y planes de suscripción ya disponibles",
      "Rotate key implementado y probado en producción",
    ],
    links: [
      { label: "Visit website →", href: "https://vsecrets.dev", external: true },
      { label: "Roadmap →", href: "/#roadmap" },
    ],
    tag: "secure access · live checkout · key rotation",
    destacado: true,
  },
  {
    key: "behavioral_shield",
    nombre: "Behavioral Shield",
    estado: "COMING SOON",
    desc: "La línea de análisis conductual de Evilink, enfocada en señales de comportamiento, detección temprana de riesgo y posible colaboración con la capa de seguridad del ecosistema.",
    bullets: [
      "Base técnica avanzada con dashboard y SDK en evolución",
      "Permanece en radar dentro de la línea de seguridad",
      "Su posible colaboración con Secure_Link será parte del análisis de siguientes pasos",
    ],
    tag: "behavioral signals · security layer · candidate",
    links: [{ label: "Roadmap →", href: "/#roadmap" }],
    destacado: false,
  },
  {
    key: "status_hub",
    nombre: "Status-Hub",
    estado: "LIVE",
    desc: "La capa de monitoreo operativo de Evilink, diseñada para exponer salud de servicios, visibilidad del ecosistema y señales tempranas de degradación.",
    bullets: [
      "Métricas reales construidas desde los servicios del ecosistema",
      "Consola enriquecida con más visibilidad operativa",
      "Camino más claro hacia una capa de observabilidad más inteligente",
    ],
    tag: "monitoring · observability · IO path",
    links: [{ label: "View status →", href: "/status" }],
    destacado: true,
  },
];