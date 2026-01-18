// lib/nexusProduct.ts
export type NexusProduct = "curpify" | "cryptolink" | "evilink";

export function getNexusProductFromPath(pathname: string): NexusProduct {
  const p = (pathname || "").toLowerCase();

  // Si tu catálogo vive bajo /products/...
  if (p.startsWith("/products/")) {
    // /products/curpify  o /products/cryptolink
    if (p.includes("/curpify")) return "curpify";
    if (p.includes("/cryptolink")) return "cryptolink";
  }

  // Si en algún momento también lo tienes como rutas directas:
  if (p.startsWith("/curpify")) return "curpify";
  if (p.startsWith("/cryptolink")) return "cryptolink";

  // Default: el sitio
  return "evilink";
}
