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
    desc: "La API de inteligencia cripto de Evilink ahora evoluciona a v4 y empieza a consolidarse como un portal de referencia con datos reales, contexto enriquecido y una experiencia de mercado más madura.",
    bullets: [
      "Versión 4 ya operando como nueva etapa del producto",
      "Market360º mejora la lectura del mercado dentro del portal",
      "Combina datos derivados de CryptoLink con contexto real provisto por Social_Link",
    ],
    tag: "v4 · market portal · Railway · Stripe",
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
    destacado: false,
  },
  {
    key: "curpify",
    nombre: "Curpify API",
    estado: "LIVE",
    desc: "La API de validación de Evilink continúa consolidándose con validación más estricta de CURP y RFC, una interfaz más alineada al ecosistema y una base más sólida para su siguiente etapa.",
    bullets: [
      "Valida CURP y RFC con dígito verificador",
      "Nueva interfaz más alineada al ecosistema Evilink",
      "Hardening reciente en seguridad y operación",
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
    desc: "La capa de integración de Evilink: acceso unificado, coordinación de productos y experiencia guiada sobre el ecosistema.",
    bullets: [
      "Knowledge-driven sobre docs y capacidades oficiales",
      "Avanza hacia una integración más sólida con MCP-One",
      "Orquesta y enruta sin absorber lógica pesada",
    ],
    tag: "integrador oficial · evolución activa",
    links: [
      { label: "Roadmap →", href: "/#roadmap" },
    ],
    destacado: false,
  },
  {
    key: "secure_link",
    nombre: "Secure_Link",
    estado: "PLATFORM",
    desc: "La línea de seguridad de Evilink, enfocada en señales de riesgo, protección y dirección estratégica para futuros módulos.",
    bullets: [
      "Risk Signals ya existe como versión lite inicial",
      "Permanece como uno de los emblemas del ecosistema",
      "Su siguiente fase se prepara para próximos ciclos",
    ],
    tag: "security line · next focus",
    links: [{ label: "Roadmap →", href: "/#roadmap" }],
    destacado: false,
  },
  {
    key: "data_link",
    nombre: "Data_Link",
    estado: "PLATFORM",
    desc: "Procesamiento de datos para archivos pesados, con resultados sólidos en pruebas y una dirección clara hacia flujos más potentes.",
    bullets: [
      "Resultados fuertes con datasets de alto volumen",
      "Motor optimizado con multiprocessing y chunk sizing",
      "Sigue consolidándose como una de las líneas más prometedoras del ecosistema",
    ],
    tag: "high-volume engine · strong core",
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
      "La revocación de runtime keys corta acceso real en Nexus",
    ],
    links: [
      { label: "See roadmap →", href: "/#roadmap" },
    ],
    tag: "secure access · real-time key control",
    destacado: true,
  },
  {
    key: "vision_link",
    nombre: "Vision_Link",
    estado: "COMING SOON",
    desc: "La línea de visión computacional de Evilink, orientada a detección e inferencia visual como parte de su exploración avanzada.",
    bullets: [
      "Ya existe una v1 basada en YOLOv11",
      "Actualmente en pausa estratégica",
      "Permanece en radar como línea futura del ecosistema",
    ],
    tag: "YOLOv11 · paused · computer vision",
    links: [{ label: "Roadmap →", href: "/#roadmap" }],
    destacado: false,
  },
  {
    key: "status_hub",
    nombre: "Status-Hub",
    estado: "LIVE",
    desc: "La capa de monitoreo operativo de Evilink, diseñada para exponer salud de servicios y visibilidad del ecosistema en tiempo real.",
    bullets: [
      "Ya reveló y previno bugs y debilidades de seguridad a tiempo",
      "Checks reales y métricas operativas ya integradas en el portal",
      "Su evolución futura como capa de observabilidad se vuelve cada vez más natural",
    ],
    tag: "monitoring · prevention · live ops",
    links: [{ label: "Roadmap →", href: "/#roadmap" }],
    destacado: true,
  },
];