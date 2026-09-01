import React, { useState } from "react";

const SAMPLE = `TITLE: THE LAST SIGNAL

INT. OBSERVATORY - NIGHT

MARA (30s), an astrophysicist, watches a monitor as a strange
frequency pulses from a distant star. She grabs a phone.

MARA
It's repeating. It's not noise.

EXT. COASTAL ROAD - DAWN

Mara drives a battered van along cliffs. A figure, JONAS (40s),
waves her down from the roadside. He carries a rusted radio.

JONAS
I've been hearing it too. Since 1977.`;

const MIN_BUDGET = 50000;
const MAX_BUDGET = 250000000;
const PRESETS = [
  { label: "$100K", value: 100000 },
  { label: "$1M", value: 1000000 },
  { label: "$10M", value: 10000000 },
  { label: "$50M", value: 50000000 },
  { label: "$100M", value: 100000000 },
];

function budgetToSlider(dollars) {
  const c = Math.max(MIN_BUDGET, Math.min(MAX_BUDGET, dollars));
  return Math.round((1000 * Math.log(c / MIN_BUDGET)) / Math.log(MAX_BUDGET / MIN_BUDGET));
}
function sliderToBudget(v) {
  return Math.round(MIN_BUDGET * Math.pow(MAX_BUDGET / MIN_BUDGET, v / 1000));
}
function formatBudget(d) {
  if (d >= 1000000000) return `$${(d / 1000000000).toFixed(1)}B`;
  if (d >= 1000000) return `$${(d / 1000000).toFixed(d >= 10000000 ? 0 : 1)}M`;
  if (d >= 1000) return `$${Math.round(d / 1000)}K`;
  return `$${d}`;
}

export default function ScriptTerminal({ onAnalyze, loading, error }) {
  const [script, setScript] = useState("");
  const [budget, setBudget] = useState(10000000);

  return (
    <section id="terminal" className="relative px-5 py-20 md:px-8 md:py-28">
      <div
        className="mx-auto max-w-3xl border-2 border-foreground bg-background/85 p-6 backdrop-blur-md md:p-8"
        style={{ boxShadow: "8px 8px 0 0 hsl(var(--foreground))" }}
      >
        <div className="flex items-center justify-between border-b-2 border-dashed border-foreground pb-3">
          <span className="font-mono-tech text-[10px] uppercase tracking-widest text-foreground/60">
            CINEMIND AI · COUPON · NO. 001
          </span>
          <span className="font-mono-tech text-[10px] uppercase tracking-widest text-laser">
            ★ Act Now!
          </span>
        </div>

        <div className="my-6 text-center">
          <span className="font-mono-tech text-[10px] uppercase tracking-widest text-laser">
            §01 — Source Script Input
          </span>
          <h2 className="mt-2 font-heading text-4xl leading-none tracking-tight md:text-5xl">
            ACT NOW! SUBMIT SCRIPT
          </h2>
          <p className="mx-auto mt-3 max-w-md font-body text-sm leading-relaxed text-foreground/60">
            Paste your screenplay and set your budget. The engine estimates what
            the film actually costs — and tells you if you're in or out of budget.
          </p>
        </div>

        <div className="mb-5">
          <div className="flex items-center justify-between">
            <span className="font-mono-tech text-[10px] uppercase tracking-widest text-foreground/60">
              §00 — Your Production Budget
            </span>
            <span className="font-heading text-2xl tracking-tight text-laser">
              {formatBudget(budget)}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={1000}
            value={budgetToSlider(budget)}
            onChange={(e) => setBudget(sliderToBudget(Number(e.target.value)))}
            className="mt-3 w-full cursor-pointer accent-[hsl(var(--laser))]"
          />
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <input
              type="number"
              value={budget}
              min={MIN_BUDGET}
              max={MAX_BUDGET}
              step={10000}
              onChange={(e) => setBudget(Math.max(MIN_BUDGET, Math.min(MAX_BUDGET, Number(e.target.value) || MIN_BUDGET)))}
              className="w-32 border-2 border-foreground bg-background px-2 py-1 font-mono-tech text-xs text-foreground focus:outline-none"
            />
            <span className="font-mono-tech text-[9px] uppercase tracking-widest text-foreground/40">USD</span>
            <div className="ml-auto flex flex-wrap gap-1.5">
              {PRESETS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setBudget(p.value)}
                  className={`border border-foreground/40 px-2 py-1 font-mono-tech text-[10px] uppercase tracking-widest transition-colors ${
                    budget === p.value ? "bg-foreground text-background" : "text-foreground/70 hover:bg-foreground hover:text-background"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="border-2 border-dashed border-foreground p-3">
          <textarea
            value={script}
            onChange={(e) => setScript(e.target.value)}
            placeholder="PASTE YOUR SCREENPLAY HERE…"
            spellCheck={false}
            className="h-48 w-full resize-none bg-background/50 font-mono-tech text-sm leading-relaxed text-foreground placeholder:text-foreground/30 focus:outline-none md:h-56 md:text-base"
          />
          <div className="mt-2 flex items-center justify-between font-mono-tech text-[10px] uppercase tracking-widest text-foreground/50">
            <span>{script.length} chars</span>
            <button
              onClick={() => setScript(SAMPLE)}
              className="border border-foreground/40 px-2 py-1 text-foreground/70 hover:bg-foreground hover:text-background"
            >
              load sample
            </button>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-4">
          <button
            onClick={() => onAnalyze(script, budget)}
            disabled={loading || !script.trim()}
            className="border-2 border-foreground bg-laser px-5 py-3 font-mono-tech text-[11px] uppercase tracking-widest text-background transition-transform enabled:hover:-translate-y-0.5 enabled:hover:translate-x-0.5 disabled:opacity-50"
          >
            {loading ? "▸ analyzing…" : "▸ submit to engine"}
          </button>
          {error && (
            <span className="font-mono-tech text-[11px] uppercase tracking-widest text-laser">
              ✗ {error}
            </span>
          )}
          <span className="ml-auto font-mono-tech text-[10px] uppercase tracking-widest text-foreground/40">
            gemini-3.6-flash · structured JSON
          </span>
        </div>
      </div>
    </section>
  );
}
