"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { events, type TimelineEvent } from "@/data/events";
import EventModal from "@/components/EventModal";

function getSortKey(e: TimelineEvent): number {
  if (e.year !== undefined) return e.year;
  return new Date(e.date! + "T00:00:00").getFullYear() +
    new Date(e.date! + "T00:00:00").getMonth() / 12 +
    new Date(e.date! + "T00:00:00").getDate() / 365;
}

function getCardDate(e: TimelineEvent): string {
  if (e.displayDate) return e.displayDate;
  const d = new Date(e.date! + "T00:00:00");
  const month = d.toLocaleDateString("uk-UA", { month: "short" });
  return `${month} ${d.getFullYear()}`;
}

const sorted = [...events].sort((a, b) => getSortKey(a) - getSortKey(b));

export default function Timeline() {
  const [selected, setSelected] = useState<TimelineEvent | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <>
      <div className="relative mx-auto w-full max-w-4xl px-4 py-16">
        {/* Central vertical line — desktop */}
        <div
          className="pointer-events-none absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden md:block"
          style={{
            background:
              "linear-gradient(to bottom, transparent, #6366f1 5%, #a855f7 50%, #6366f1 95%, transparent)",
          }}
        />
        {/* Left-aligned line — mobile */}
        <div
          className="pointer-events-none absolute left-5 top-0 bottom-0 w-px md:hidden"
          style={{
            background:
              "linear-gradient(to bottom, transparent, #6366f1 5%, #a855f7 50%, #6366f1 95%, transparent)",
          }}
        />

        <ol className="relative list-none space-y-10 md:space-y-14">
          {sorted.map((event, i) => {
            const isLeft = i % 2 === 0;
            const isHovered = hovered === i;

            return (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: 0.04 * Math.min(i, 8) }}
                className={`relative flex items-center gap-4 md:gap-0 ${
                  isLeft ? "md:flex-row-reverse" : "md:flex-row"
                }`}
              >
                {/* Card — desktop */}
                <button
                  onClick={() => setSelected(event)}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  className={`hidden md:flex w-[44%] cursor-pointer flex-col rounded-xl border p-4 text-left transition-all duration-200 ${
                    isLeft ? "mr-auto items-end" : "ml-auto items-start"
                  } ${
                    isHovered
                      ? "border-indigo-500/60 bg-zinc-800/90 shadow-lg shadow-indigo-900/30"
                      : "border-white/8 bg-zinc-900/70 hover:border-white/20 hover:bg-zinc-800/70"
                  }`}
                >
                  <span className="mb-1 text-xs font-semibold text-amber-400">
                    {getCardDate(event)}
                  </span>
                  <span className="text-sm font-medium leading-snug text-white/90">
                    {event.title}
                  </span>
                  {event.topic && (
                    <span className="mt-2 text-xs text-zinc-500 line-clamp-1">
                      {event.topic}
                    </span>
                  )}
                </button>

                {/* Dot — desktop */}
                <div className="relative z-10 hidden md:flex w-[12%] justify-center">
                  <button
                    onClick={() => setSelected(event)}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    className="group relative flex h-4 w-4 items-center justify-center"
                    aria-label={event.title}
                  >
                    <span
                      className={`absolute inset-0 rounded-full transition-all duration-300 ${
                        isHovered
                          ? "scale-[2.5] bg-indigo-500/20"
                          : "scale-0 bg-indigo-500/0"
                      }`}
                    />
                    <span
                      className={`h-3 w-3 rounded-full border-2 transition-all duration-200 ${
                        isHovered
                          ? "scale-125 border-indigo-400 bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.8)]"
                          : "border-indigo-500/70 bg-zinc-800"
                      }`}
                    />
                  </button>
                </div>

                {/* Empty right spacer — desktop */}
                <div className="hidden md:block w-[44%]" />

                {/* Mobile layout */}
                <div className="relative z-10 flex md:hidden items-start gap-4 pl-10 w-full">
                  <div className="absolute left-[14px] top-2 flex h-4 w-4 items-center justify-center">
                    <span className="h-3 w-3 rounded-full border-2 border-indigo-500/70 bg-zinc-800" />
                  </div>
                  <button
                    onClick={() => setSelected(event)}
                    className="flex w-full cursor-pointer flex-col rounded-xl border border-white/8 bg-zinc-900/70 p-4 text-left active:bg-zinc-800"
                  >
                    <span className="mb-1 text-xs font-semibold text-amber-400">
                      {getCardDate(event)}
                    </span>
                    <span className="text-sm font-medium leading-snug text-white/90">
                      {event.title}
                    </span>
                    {event.topic && (
                      <span className="mt-2 text-xs text-zinc-500 line-clamp-1">
                        {event.topic}
                      </span>
                    )}
                  </button>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>

      <EventModal event={selected} onClose={() => setSelected(null)} />
    </>
  );
}
