// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NexusWidget from "./components/NexusWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// --- METADATA ACTUALIZADA ---
export const metadata: Metadata = {
  title: "evi_link devs · Backend · APIs · Automation",
  description:
    "Estudio de desarrollo backend enfocado en APIs, automatizaciones y servicios listos para producción. Construido desde Ciudad de México.",
  keywords: [
    "APIs",
    "backend",
    "integraciones",
    "automatización",
    "Next.js",
    "Node.js",
    "fintech",
    "webhooks",
    "Curpify",
    "Mexico",
  ],
  authors: [{ name: "evi_link devs" }],
  openGraph: {
    title: "evi_link devs",
    description:
      "APIs, automatización y servicios backend con enfoque en performance y mantenibilidad.",
    url: "https://evilink.dev",
    siteName: "evi_link devs",
    type: "website",
  },
};
// --------------------------------

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <NexusWidget />
      </body>
    </html>
  );
}