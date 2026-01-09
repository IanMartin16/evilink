import Link from "next/link";
import type { Product } from "@/lib/products";

function statusLabel(s: Product["status"]) {
  if (s === "live") return "LIVE";
  if (s === "beta") return "BETA";
  return "COMING SOON";
}

export default function ProductCard({ p }: { p: Product }) {
  const disabled = p.status === "coming_soon";

  const card = (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold">{p.name}</h3>
        <span className="text-xs rounded-full px-2 py-1 border border-white/15 bg-black/20">
          {statusLabel(p.status)}
        </span>
      </div>

      <p className="mt-2 text-sm text-white/70">{p.short}</p>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-white/60">{p.badge ?? ""}</span>
        <span className={"text-sm " + (disabled ? "text-white/40" : "text-white")}>
          {disabled ? "Próximamente" : "Ver detalles →"}
        </span>
      </div>
    </div>
  );

  return disabled ? (
    <div className="opacity-70 cursor-not-allowed">{card}</div>
  ) : (
    <Link href={p.href} className="block">{card}</Link>
  );
}

