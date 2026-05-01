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
    desc: "La API de inteligencia cripto de Evilink, ahora consolidada en su versión 3 con una base estable y lista para su siguiente evolución.",
    bullets: [
      "Versión 3 cerrada formalmente y operando con estabilidad",
      "Streaming SSE en tiempo real",
      "Planes, API keys y checkout integrados",
    ],
    tag: "v3 · Railway · Stripe · Resend · Postgres",
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
    desc: "La capa de tendencias y señales sociales de Evilink, diseñada para enriquecer productos con contexto en tiempo real.",
    bullets: [
      "Ya obtiene trends usando CoinGecko y Alternative.me",
      "Sus trends ya están integrados en CryptoLink",
      "Sigue evolucionando como línea estratégica de señales",
    ],
    tag: "Trends · CoinGecko · Alternative.me",
    links: [{ label: "Roadmap →", href: "/#roadmap" }],
    destacado: false,
  },
  {
    key: "curpify",
    nombre: "Curpify API",
    estado: "LIVE",
    desc: "La API de validación CURP de Evilink, ya operativa y lista como base real para futuros flujos de validación más amplios.",
    bullets: [
      "Validación de CURP lista para producción",
      "Infraestructura estable y monetización integrada",
      "Actualmente en observación tras su soft launch",
    ],
    tag: "Next.js · Postgres · Stripe",
    links: [{ label: "Comprar →", href: "https://curpify.com/pricing", external: true }],
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
    tag: "Integrador oficial · evolución activa",
    links: [
      { label: "Roadmap →", href: "/#roadmap" },
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
      "Permanece como uno de los emblemas del ecosistema",
      "Su siguiente fase se prepara para próximos ciclos",
    ],
    tag: "Security line · next focus",
    links: [{ label: "Roadmap →", href: "/#roadmap" }],
    destacado: false,
  },
  {
    key: "data_link",
    nombre: "Data_Link",
    estado: "PLATFORM",
    desc: "Procesamiento de datos para archivos pesados, con resultados sólidos en pruebas y una dirección clara hacia flujos más potentes.",
    bullets: [
      "Resultados fuertes con datasets de millones de registros",
      "Optimización con multiprocessing y chunk sizing",
      "v1 en observación final antes de perfilar su siguiente salida",
    ],
    tag: "High-volume processing · v1 observing",
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
      "Fuerte candidata al ciclo de soft launch de junio",
    ],
    links: [
      { label: "See roadmap →", href: "#roadmap" },
    ],
    tag: "junio · soft launch candidate",
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
      "v1 funcional desplegada con checks automatizados",
      "Ya integrada como sección dentro del portal Evilink",
      "Base lista para futuras mejoras de observabilidad",
    ],
    tag: "Monitoring · Railway · Postgres",
    links: [{ label: "Roadmap →", href: "/#roadmap" }],
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