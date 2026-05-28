"use client";

import { useState, useEffect, useCallback } from "react";
import { events, type TimelineEvent } from "@/data/events";

type Mode = "date-first" | "event-first";

interface Progress {
  known: string[];
  unknown: string[];
}

const STORAGE_KEY = "timeline-flashcard-progress";

function getDisplayDate(event: TimelineEvent): string {
  if (event.displayDate) return event.displayDate;
  if (event.date) {
    const d = new Date(event.date + "T00:00:00");
    return d.toLocaleDateString("uk-UA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  return String(event.year);
}

// Descriptions are formatted as "DATE — actual text". Strip the date prefix.
function stripDatePrefix(description: string): string {
  const idx = description.lastIndexOf("—");
  if (idx === -1) return description;
  const after = description.slice(idx + 1).trimStart();
  return after.charAt(0).toUpperCase() + after.slice(1);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function FlashCards() {
  const [mode, setMode] = useState<Mode>("date-first");
  const [deck, setDeck] = useState<TimelineEvent[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [progress, setProgress] = useState<Progress>({ known: [], unknown: [] });
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setProgress(JSON.parse(stored));
      } catch {
        // ignore
      }
    }
    setDeck(shuffle(events));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const card = deck[index];

  const advance = useCallback(
    (answer: "known" | "unknown" | "skip") => {
      if (!card) return;
      if (answer !== "skip") {
        const key = card.title;
        setProgress((p) =>
          answer === "known"
            ? { known: [...new Set([...p.known, key])], unknown: p.unknown.filter((k) => k !== key) }
            : { unknown: [...new Set([...p.unknown, key])], known: p.known.filter((k) => k !== key) }
        );
      }
      setFlipped(false);
      if (index + 1 >= deck.length) {
        setFinished(true);
      } else {
        setIndex((i) => i + 1);
      }
    },
    [card, index, deck.length]
  );

  const reshuffle = () => {
    setDeck(shuffle(events));
    setIndex(0);
    setFlipped(false);
    setFinished(false);
  };

  const resetProgress = () => {
    setProgress({ known: [], unknown: [] });
    reshuffle();
  };

  const knownCount = progress.known.length;
  const unknownCount = progress.unknown.length;
  const totalAnswered = knownCount + unknownCount;
  const knownPct = (knownCount / events.length) * 100;
  const unknownPct = (unknownCount / events.length) * 100;

  const prevStatus = card
    ? progress.known.includes(card.title)
      ? "known"
      : progress.unknown.includes(card.title)
      ? "unknown"
      : null
    : null;

  if (finished) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 flex flex-col items-center gap-6 text-center">
        <div className="text-5xl">🎉</div>
        <h2 className="text-xl font-bold text-white">Всі картки пройдено!</h2>
        <div className="flex gap-8 text-sm">
          <div>
            <p className="text-2xl font-bold text-green-400">{knownCount}</p>
            <p className="text-zinc-500">знаю</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-400">{unknownCount}</p>
            <p className="text-zinc-500">не знаю</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-zinc-400">{events.length - totalAnswered}</p>
            <p className="text-zinc-500">пропущено</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={reshuffle}
            className="px-5 py-2.5 rounded-xl bg-amber-500 text-black font-medium hover:bg-amber-400 transition-colors text-sm"
          >
            Пройти знову
          </button>
          <button
            onClick={resetProgress}
            className="px-5 py-2.5 rounded-xl bg-zinc-800 text-zinc-400 hover:bg-zinc-700 transition-colors text-sm"
          >
            Скинути прогрес
          </button>
        </div>
      </div>
    );
  }

  if (!card) return null;

  const dateContent = (
    <div className="flex flex-col items-center justify-center h-full gap-3 px-6">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">Дата</p>
      <p className="text-2xl sm:text-3xl font-bold text-white text-center leading-snug">
        {getDisplayDate(card)}
      </p>
    </div>
  );

  const eventContent = (
    <div className="flex flex-col items-center justify-center h-full gap-3 px-6 overflow-hidden">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">Подія</p>
      <p className="text-xl sm:text-2xl font-bold text-white text-center leading-snug">
        {card.title}
      </p>
      <p className="text-xs sm:text-sm text-zinc-400 text-center leading-relaxed line-clamp-5 mt-1">
        {stripDatePrefix(card.description)}
      </p>
    </div>
  );

  const front = mode === "date-first" ? dateContent : eventContent;
  const back = mode === "date-first" ? eventContent : dateContent;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 flex flex-col gap-5">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            onClick={() => { setMode("date-first"); setFlipped(false); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              mode === "date-first"
                ? "bg-amber-500 text-black"
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
            }`}
          >
            Дата → Подія
          </button>
          <button
            onClick={() => { setMode("event-first"); setFlipped(false); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              mode === "event-first"
                ? "bg-amber-500 text-black"
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
            }`}
          >
            Подія → Дата
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={reshuffle}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 text-zinc-400 hover:bg-zinc-700 transition-colors"
          >
            Перемішати
          </button>
          <button
            onClick={resetProgress}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 text-red-400 hover:bg-zinc-700 transition-colors"
          >
            Скинути
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-green-400 font-medium">{knownCount} знаю</span>
          <span className="text-zinc-500">{index + 1} / {deck.length}</span>
          <span className="text-red-400 font-medium">{unknownCount} не знаю</span>
        </div>
        <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden flex">
          <div
            className="h-full bg-green-500 transition-all duration-500"
            style={{ width: `${knownPct}%` }}
          />
          <div
            className="h-full bg-red-500 transition-all duration-500"
            style={{ width: `${unknownPct}%` }}
          />
        </div>
      </div>

      {/* Card */}
      <div
        className="relative h-64 sm:h-72 cursor-pointer select-none"
        style={{ perspective: "1200px" }}
        onClick={() => setFlipped((f) => !f)}
      >
        {/* Previous status indicator */}
        {prevStatus && (
          <div
            className={`absolute top-3 right-3 z-10 w-2.5 h-2.5 rounded-full ${
              prevStatus === "known" ? "bg-green-500" : "bg-red-500"
            }`}
          />
        )}

        <div
          className="absolute inset-0 transition-transform duration-500"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 rounded-2xl border border-white/8 bg-zinc-900"
            style={{ backfaceVisibility: "hidden" }}
          >
            {front}
            {!flipped && (
              <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] text-zinc-700 whitespace-nowrap">
                Натисніть щоб перевернути
              </p>
            )}
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 rounded-2xl border border-white/8 bg-zinc-900"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            {back}
          </div>
        </div>
      </div>

      {/* Action buttons — visible after flip */}
      <div
        className="flex gap-3 transition-all duration-300"
        style={{ opacity: flipped ? 1 : 0, pointerEvents: flipped ? "auto" : "none" }}
      >
        <button
          onClick={(e) => { e.stopPropagation(); advance("unknown"); }}
          className="flex-1 py-3 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 font-medium text-sm hover:bg-red-500/20 active:scale-95 transition-all"
        >
          Не знаю
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); advance("skip"); }}
          className="px-5 py-3 rounded-xl border border-white/5 bg-zinc-800 text-zinc-500 text-sm hover:bg-zinc-700 active:scale-95 transition-all"
        >
          Пропустити
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); advance("known"); }}
          className="flex-1 py-3 rounded-xl border border-green-500/20 bg-green-500/10 text-green-400 font-medium text-sm hover:bg-green-500/20 active:scale-95 transition-all"
        >
          Знаю
        </button>
      </div>
    </div>
  );
}
