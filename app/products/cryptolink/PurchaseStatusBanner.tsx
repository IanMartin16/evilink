"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function PurchaseStatusBanner() {
  const sp = useSearchParams();
  const status = sp.get("status"); // success | cancel | null
  const plan = sp.get("plan");     // PRO | BUSINESS | null

  const router = useRouter();
  const pathname = usePathname();

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!status) {
      setVisible(false);
      return;
    }

    setVisible(true);

    // ✅ deja el banner 5 segundos y luego limpia la URL
    const t = setTimeout(() => {
      setVisible(false);
      router.replace(pathname + "#purchase"); // opcional: te manda al widget
    }, 5000);

    return () => clearTimeout(t);
  }, [status, router, pathname]);

  if (!status || !visible) return null;

  const isSuccess = status === "success";

  return (
    <div
      style={{
        border: "1px solid rgba(255,255,255,.14)",
        background: isSuccess ? "rgba(66,245,179,.10)" : "rgba(255,180,180,.08)",
        borderRadius: 14,
        padding: 12,
        marginBottom: 16,
      }}
    >
      <div style={{ fontWeight: 800 }}>
        {isSuccess ? "Pago confirmado" : "Pago cancelado"}
      </div>

      <div style={{ opacity: 0.85, marginTop: 4 }}>
        {isSuccess
          ? `Listo${plan ? ` (${plan})` : ""}. Si el pago se confirmó, tu API Key te llega por correo en unos minutos.`
          : "No pasó nada 🙂 Puedes volver a intentar cuando quieras."}
      </div>

      {!isSuccess && (
        <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
          <a className="btn-primary" href="#purchase">
            Reintentar checkout
          </a>

          {/* opcional: cerrar manual */}
          <button
            type="button"
            className="btn-secondary"
            onClick={() => router.replace(pathname + "#purchase")}
          >
            Cerrar
          </button>
        </div>
      )}
    </div>
  );
}
