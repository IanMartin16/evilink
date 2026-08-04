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
    desc: "La API de inteligencia cripto de Evilink evoluciona a v4 y se consolida como un portal de referencia con datos reales, contexto enriquecido y una experiencia de mercado más madura.",
    bullets: [
      "Versión 4 ya operando como nueva etapa del producto",
      "Market360º y Derived Intelligence fortalecen la lectura del mercado",
      "Los endpoints price y prices ahora exponen precio, cambio 24h y market cap en un contrato enriquecido",
    ],
    tag: "v4 · enriched API · market portal",
    links: [
      { label: "Go Cryptolink.mx →", href: "https://cryptolink.mx/dashboard", external: true },
      { label: "Docs →", href: "https://cryptolink.mx/docs", external: true },
    ],
    destacado: true,
  },
  {
    key: "social_link",
    nombre: "Social_Link",
    estado: "PLATFORM",
    desc: "La capa de tendencias y señales sociales de Evilink, ahora consolidada como una API confiable que aporta contexto real de mercado dentro de CryptoLink.",
    bullets: [
      "Ya no funciona como placeholder: entrega datos valiosos de mercado",
      "Alimenta cerca del 50% del contexto visible en el portal de CryptoLink",
      "Enriquece la lectura del mercado junto con derivados propios de CryptoLink",
    ],
    tag: "signals API · real market context",
    links: [{ label: "Roadmap →", href: "/#roadmap" }],
    destacado: true,
  },
  {
    key: "curpify",
    nombre: "Curpify API",
    estado: "LIVE",
    desc: "La API de validación de Evilink continúa consolidándose con validación más estricta, una interfaz más alineada al ecosistema y una base más sólida para su siguiente etapa.",
    bullets: [
      "Valida CURP y RFC con dígito verificador",
      "Nueva interfaz más alineada al ecosistema Evilink",
      "Hardening reciente en seguridad, operación y experiencia",
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
      "Candidato serio para una futura etapa de soft launch",
      "Su siguiente fase analizará posibles colaboraciones con nuevas capas de seguridad y protección del ecosistema",
    ],
    tag: "risk signals · security line · candidate",
    links: [{ label: "Roadmap →", href: "/#roadmap" }],
    destacado: true,
  },
  {
    key: "data_link",
    nombre: "Data_Link",
    estado: "PLATFORM",
    desc: "Procesamiento de datos para archivos pesados, con resultados sólidos en pruebas y una dirección clara hacia flujos más potentes.",
    bullets: [
      "Resultados fuertes con datasets de alto volumen",
      "Motor optimizado con multiprocessing y chunk sizing",
      "Homologación reciente de criterios de seguridad y operación comercial",
    ],
    tag: "high-volume engine · data processing · strong core",
    links: [{ label: "Roadmap →", href: "/#roadmap" }],
    destacado: true,
  },
  {
    key: "vsecrets",
    nombre: "V-Secrets",
    estado: "PLATFORM",
    desc: "La capa de gestión segura de secretos de Evilink, enfocada en cifrado, control, versionado y acceso programático para productos y equipos.",
    bullets: [
      "AES-256-GCM, versionado, auditoría y autenticación por API key",
      "Base sólida con PostgreSQL y Redis",
      "La revocación de runtime keys corta acceso real en integraciones del ecosistema",
    ],
    links: [
      { label: "See roadmap →", href: "/#roadmap" },
    ],
    tag: "secure access · real-time key control",
    destacado: false,
  },
  {
    key: "behavioral_shield",
    nombre: "Behavioral Shield",
    estado: "COMING SOON",
    desc: "La línea de análisis conductual de Evilink, enfocada en señales de comportamiento, detección temprana de riesgo y posible colaboración con la capa de seguridad del ecosistema.",
    bullets: [
      "Base técnica avanzada con dashboard y SDK en evolución",
      "Se perfila como candidato para una futura etapa de soft launch",
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
      "Checks reales y métricas operativas ya integradas en el portal",
      "Ayuda a detectar degradaciones, inconsistencias y puntos de mejora a tiempo",
      "Su evolución futura hacia una capa de observabilidad más inteligente se vuelve cada vez más natural",
    ],
    tag: "monitoring · observability · live ops",
    links: [{ label: "Roadmap →", href: "/#roadmap" }],
    destacado: true,
  },
];