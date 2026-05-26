import Timeline from "@/components/Timeline";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-zinc-950/90 backdrop-blur-md">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <h1 className="text-lg font-bold tracking-tight text-white">
            Хронологічна стрічка подій
          </h1>
          <p className="text-xs text-zinc-500">
            Ключові події історії України · Натисніть на подію для деталей
          </p>
        </div>
      </header>

      {/* Timeline */}
      <Timeline />

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-xs text-zinc-600">
        Клікніть на будь-яку подію, щоб дізнатись більше
      </footer>
    </main>
  );
}
