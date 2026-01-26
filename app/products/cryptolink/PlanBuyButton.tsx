"use client";
import styles from "./cryptolink.module.css";

export default function PlanBuyButton({
  plan,
  label,
}: {
  plan: "BUSINESS" | "PRO";
  label?: string;
}) {
  const variant = plan === "PRO" ? styles.buyBtnPro : styles.buyBtnBusiness;
  return (
    <button
      type="button"
      className={`${styles.planBadge}`}
      onClick={() => (window as any).__cryptolinkPurchase?.(plan)}
    >
      {label ?? `Comprar ${plan}`}
    </button>
  );
}
