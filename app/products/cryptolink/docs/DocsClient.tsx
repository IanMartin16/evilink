"use client";

import dynamic from "next/dynamic";
import { cryptolinkDocs } from "@/lib/cryptolink/docs";

const DocsRenderer = dynamic(() => import("@/components/cryptolink/DocsRenderer"), {
  ssr: false,
});

export default function DocsClient() {
  return <DocsRenderer docs={cryptolinkDocs} />;
}
