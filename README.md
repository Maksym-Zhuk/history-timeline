# Timeline — Хронологічна стрічка подій

Interactive chronological timeline viewer for key events in Ukrainian history.

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Adding new events

Open `src/data/events.ts` and add a new object to the `events` array:

```ts
{
  date: "YYYY-MM-DD",      // ISO date — used for sorting and display
  title: "Short title",    // shown on the timeline card
  description: "Full text shown in the modal when you click the event.",
  topic: "Optional category label",  // shown as a badge in the modal
}
```

Events are sorted chronologically at runtime, so you can insert entries anywhere in the array.

## Stack

- **Next.js 14** (App Router) — framework
- **TypeScript** — type safety
- **Tailwind CSS** — styling
- **Framer Motion** — scroll animations & modal transitions
- **Inter** (Google Fonts, with Cyrillic subset) — typography
