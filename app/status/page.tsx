import ServiceHealthStatusPage from "@/components/ServiceHealthStatusPage";

export default function StatusPage() {
  return (
    <main className="min-h-screen bg-red-500 text-white p-10">
      <h1 className="text-5xl font-bold">Test Tailwind</h1>
      <div className="mx-auto max-w-6xl px-6 py-12 md:px-10 md:py-16">
        <ServiceHealthStatusPage />
      </div>
    </main>
  );
}
