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
    desc: "Inteligencia cripto en evolución continua, con precios, señales y una base sólida rumbo a su siguiente gran versión.",
    bullets: [
      "Actualmente en v2.8 y cerca de su versión objetivo",
      "Streaming SSE en tiempo real",
      "Planes, API keys y checkout integrados",
    ],
    tag: "Railway · Stripe · Resend · Postgres",
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
    desc: "La capa de tendencias y señales sociales de Evilink, diseñada para enriquecer productos con insights en tiempo real.",
    bullets: [
      "Ya obtiene trends usando CoinGecko y Alternative.me",
      "Sus trends ya están integrados en CryptoLink",
      "Evoluciona como línea estratégica para señales y contexto",
    ],
    tag: "Trends · CoinGecko · Alternative.me",
    links: [{ label: "Roadmap →", href: "/productos#roadmap" }],
    destacado: false,
  },
  {
    key: "curpify",
    nombre: "Curpify API",
    estado: "PLATFORM",
    desc: "La base actual de validación sobre la que evolucionará Validate Suite como futura capa más amplia de verificación.",
    bullets: [
      "Validación de CURP lista para producción",
      "Infraestructura estable y monetización ya integrada",
      "Base natural para la futura Validate Suite",
    ],
    tag: "Next.js · Postgres · Stripe",
    links: [{ label: "Ver producto →", href: "https://curpify.com", external: true }],
    destacado: false,
  },
  {
    key: "nexus",
    nombre: "Nexus",
    estado: "COMING SOON",
    desc: "La capa de integración de Evilink: acceso unificado, coordinación de productos y experiencia guiada sobre el ecosistema.",
    bullets: [
      "Knowledge-driven sobre docs y capacidades oficiales",
      "Evolucionando hacia su integración con MCP-One",
      "Orquesta y enruta sin absorber lógica pesada",
    ],
    tag: "Integrador oficial · evolución activa",
    links: [
      { label: "Roadmap →", href: "/productos#roadmap" },
      { label: "Join waitlist →", href: "mailto:support@evilink.dev?subject=Nexus%20waitlist", external: true },
    ],
    destacado: true,
  },
  {
    key: "secure_link",
    nombre: "Secure_Link",
    estado: "PLATFORM",
    desc: "La línea de seguridad de Evilink, enfocada en señales de riesgo, protección y dirección estratégica para futuros módulos.",
    bullets: [
      "Risk Signals ya existe como versión lite inicial",
      "Primera integración de ML con scikit-learn",
      "MVP en definición para su siguiente etapa",
    ],
    tag: "Risk Signals · scikit-learn · security",
    links: [{ label: "Roadmap →", href: "/productos#roadmap" }],
    destacado: true,
  },
  {
    key: "data_link",
    nombre: "Data_Link",
    estado: "PLATFORM",
    desc: "Procesamiento de datos para archivos pesados, con una base técnica orientada a flujos más potentes dentro del ecosistema.",
    bullets: [
      "Soporta archivos de hasta 500 MB",
      "Usa MinIO para almacenamiento y procesamiento",
      "Incubación activa con capacidad operativa real",
    ],
    tag: "MinIO · data processing · 500 MB",
    links: [{ label: "Roadmap →", href: "/productos#roadmap" }],
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
    links: [{ label: "Roadmap →", href: "/productos#roadmap" }],
    destacado: false,
  },
  {
  key: "lite_experiments",
  nombre: "Lite Experiments",
  estado: "LIVE",
  desc: "Experimentos públicos seleccionados para validar interés de mercado sin desviar el foco del ecosistema principal de Evilink.",
  bullets: [
    "Incluye releases ligeros publicados en RapidAPI",
    "Sirven para exploración controlada y validación temprana",
    "No sustituyen el roadmap de los productos core",
  ],
  tag: "RapidAPI · public experiments",
  links: [
    { label: "Explore on RapidAPI →", href: "https://rapidapi.com/studio", external: true },
  ],
  destacado: false,
}
];

