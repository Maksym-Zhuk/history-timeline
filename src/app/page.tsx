"use client";

import { useState } from "react";
import Timeline from "@/components/Timeline";
import FlashCards from "@/components/FlashCards";

type Tab = "timeline" | "flashcards";

export default function Home() {
  const [tab, setTab] = useState<Tab>("timeline");

  return (
    <main className="min-h-screen bg-zinc-950">
      <header className="sticky top-0 z-40 border-b border-white/5 bg-zinc-950/90 backdrop-blur-md">
        <div className="mx-auto max-w-4xl px-4 py-3 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-base font-bold tracking-tight text-white truncate">
              Хронологічна стрічка подій
            </h1>
            <p className="text-[11px] text-zinc-500">Ключові події історії України</p>
          </div>

          <div className="flex shrink-0 items-center gap-1 rounded-lg bg-zinc-900 p-1">
            <button
              onClick={() => setTab("timeline")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                tab === "timeline"
                  ? "bg-white/10 text-white"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Стрічка
            </button>
            <button
              onClick={() => setTab("flashcards")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                tab === "flashcards"
                  ? "bg-white/10 text-white"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Картки
            </button>
          </div>
        </div>
      </header>

      {tab === "timeline" ? <Timeline /> : <FlashCards />}

      {tab === "timeline" && (
        <footer className="border-t border-white/5 py-8 text-center text-xs text-zinc-600">
          Клікніть на будь-яку подію, щоб дізнатись більше
        </footer>
      )}
    </main>
  );
}
