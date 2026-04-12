import ServiceHealthStatusPage from "@/components/ServiceHealthStatusPage";

export default function StatusPage() {
  return (
    <main className="min-h-screen bg-[#020817] text-white">
      <div className="mx-auto max-w-6xl px-6 py-12 md:px-10 md:py-16">
        <ServiceHealthStatusPage />
      </div>
    </main>
  );
}