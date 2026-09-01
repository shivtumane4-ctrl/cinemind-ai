import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductionBinderExport from "@/components/ProductionBinderExport";
import { Image } from "@/components/ui/image";

const TABS = [
  { key: "scenes", label: "Scene Breakdown" },
  { key: "budget", label: "Budget Allocations" },
  { key: "casting", label: "Casting Cards" },
  { key: "mood", label: "Mood Board" },
];

function SprocketFrame({ children, label }) {
  return (
    <div className="border-2 border-foreground bg-paper">
      <div className="flex items-stretch">
        <div className="flex w-6 flex-col items-center justify-around border-r-2 border-foreground bg-foreground py-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="h-3 w-3 bg-background" />
          ))}
        </div>
        <div className="flex-1 p-5">{children}</div>
        <div className="flex w-6 flex-col items-center justify-around border-l-2 border-foreground bg-foreground py-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="h-3 w-3 bg-background" />
          ))}
        </div>
      </div>
      <div className="border-t-2 border-foreground bg-foreground px-3 py-1 font-mono-tech text-[9px] uppercase tracking-widest text-background">
        {label}
      </div>
    </div>
  );
}

function LoadingReel() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-foreground/60">
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.span
            key={i}
            className="h-3 w-3 bg-laser"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.12 }}
          />
        ))}
      </div>
      <span className="font-mono-tech text-[11px] uppercase tracking-widest">
        ▸ agents parsing screenplay…
      </span>
    </div>
  );
}

export default function ProductionOutput({ analysis, loading, moodImages = [], moodLoading = false }) {
  const [tab, setTab] = useState("scenes");
  const a = analysis;

  return (
    <section id="output" className="relative px-5 py-20 md:px-8 md:py-28">
      <div
        className="mx-auto max-w-5xl border-2 border-foreground bg-background/85 p-6 backdrop-blur-md md:p-10"
        style={{ boxShadow: "8px 8px 0 0 hsl(var(--foreground))" }}
      >
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="font-mono-tech text-[10px] uppercase tracking-widest text-laser">
              §02 — Production Output Workspace
            </span>
            <h2 className="mt-2 font-heading text-5xl leading-none tracking-tight md:text-6xl">
              The Reel
            </h2>
          </div>
          <div className="flex flex-col items-start gap-3 md:items-end">
            <p className="max-w-md font-body text-sm leading-relaxed text-foreground/60">
              Scene Breakdown · Budget Allocations · Casting Cards — printed as
              film-strip slides and projected onto the 3D cylinder behind.
            </p>
            {a && <ProductionBinderExport analysis={a} />}
          </div>
        </div>

        {loading ? (
          <LoadingReel />
        ) : !a ? (
          <div className="border-2 border-dashed border-foreground/40 py-16 text-center">
            <p className="font-heading text-3xl tracking-tight text-foreground/50">
              Awaiting reel…
            </p>
            <p className="mt-3 font-mono-tech text-[11px] uppercase tracking-widest text-foreground/40">
              Submit a script in the terminal above to populate the film strip.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8 border-2 border-foreground bg-paper p-5">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <h3 className="font-heading text-3xl tracking-tight md:text-4xl">
                  {a.title || "Untitled"}
                </h3>
                <span className="font-mono-tech text-[10px] uppercase tracking-widest text-laser">
                  {a.genre}
                </span>
              </div>
              <p className="mt-3 font-body text-lg italic leading-relaxed text-foreground/80">
                {a.logline}
              </p>

              {a.budget_assessment && (
                <div className="mt-5 grid gap-3 border-2 border-foreground bg-paper p-4 md:grid-cols-3">
                  <div>
                    <p className="font-mono-tech text-[9px] uppercase tracking-widest text-foreground/50">Your Budget</p>
                    <p className="font-heading text-2xl tracking-tight">${Number(a.budget_assessment.user_budget_usd).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="font-mono-tech text-[9px] uppercase tracking-widest text-foreground/50">Estimated Need</p>
                    <p className="font-heading text-2xl tracking-tight">${Number(a.budget_assessment.estimated_budget_usd).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="font-mono-tech text-[9px] uppercase tracking-widest text-foreground/50">Status</p>
                    <span className={`mt-1 inline-block px-2 py-1 font-mono-tech text-xs uppercase tracking-widest ${
                      a.budget_assessment.status === "under_budget"
                        ? "bg-foreground text-background"
                        : a.budget_assessment.status === "within_budget"
                        ? "bg-laser text-background"
                        : "border-2 border-laser text-laser"
                    }`}>
                      {a.budget_assessment.status === "under_budget"
                        ? "✓ Under Budget"
                        : a.budget_assessment.status === "within_budget"
                        ? "≈ Within Budget"
                        : "✗ Over Budget"}
                    </span>
                  </div>
                  {a.budget_assessment.note && (
                    <p className="border-t-2 border-dashed border-foreground/20 pt-3 font-body text-sm italic text-foreground/70 md:col-span-3">
                      {a.budget_assessment.note}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="mb-6 flex flex-wrap gap-2">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`border-2 border-foreground px-4 py-2 font-mono-tech text-[10px] uppercase tracking-widest transition-colors ${
                    tab === t.key ? "bg-foreground text-background" : "bg-background text-foreground hover:bg-foreground/10"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.35 }}
              >
                {tab === "scenes" && (
                  <div className="grid gap-4 md:grid-cols-2">
                    {(a.scenes || []).map((s) => (
                      <SprocketFrame key={s.number} label={`Scene ${s.number} · ~${s.estimated_minutes} min`}>
                        <p className="font-mono-tech text-sm font-bold uppercase tracking-wide text-foreground">
                          {s.slug}
                        </p>
                        <p className="mt-1 font-mono-tech text-[10px] uppercase tracking-widest text-laser">
                          {s.setting}
                        </p>
                        <p className="mt-3 font-body text-sm leading-relaxed text-foreground/80">
                          {s.description}
                        </p>
                      </SprocketFrame>
                    ))}
                  </div>
                )}

                {tab === "budget" && (
                  <div className="space-y-4">
                    <SprocketFrame label="Department Allocations · USD">
                      <div className="divide-y-2 divide-foreground/15">
                        {(a.budget || []).map((b, i) => (
                          <div key={i} className="flex items-baseline justify-between gap-4 py-3">
                            <div>
                              <p className="font-heading text-lg tracking-tight">{b.category}</p>
                              <p className="font-mono-tech text-[10px] uppercase tracking-widest text-foreground/50">
                                {b.detail}
                              </p>
                            </div>
                            <span className="font-mono-tech text-base font-bold">
                              ${Number(b.amount_usd).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </SprocketFrame>
                    <div className="flex items-center justify-between border-2 border-foreground bg-foreground px-6 py-4 text-background">
                      <span className="font-heading text-2xl tracking-tight">Total Estimated Budget</span>
                      <span className="font-mono-tech text-2xl font-bold text-laser">
                        ${Number(a.total_budget_usd || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

                {tab === "casting" && (
                  <div className="grid gap-4 md:grid-cols-2">
                    {(a.casting || []).map((c, i) => (
                      <SprocketFrame key={i} label={`Role ${i + 1}`}>
                        <div className="flex items-start gap-4">
                          <div className="flex h-16 w-16 shrink-0 items-center justify-center border-2 border-foreground bg-foreground font-heading text-3xl text-background">
                            {c.role?.charAt(0) || "?"}
                          </div>
                          <div>
                            <p className="font-heading text-2xl tracking-tight">{c.role}</p>
                            <p className="font-mono-tech text-[10px] uppercase tracking-widest text-laser">
                              {c.archetype}
                            </p>
                            <p className="mt-2 font-body text-sm leading-relaxed text-foreground/80">
                              {c.description}
                            </p>
                            <p className="mt-2 font-mono-tech text-[11px] uppercase tracking-widest text-foreground/60">
                              Suggested: <span className="text-foreground">{c.suggested_actor}</span>
                            </p>
                          </div>
                        </div>
                      </SprocketFrame>
                    ))}
                  </div>
                )}

                {tab === "mood" && (
                  <div>
                    {moodLoading ? (
                      <div className="flex flex-col items-center justify-center gap-4 py-16">
                        <div className="flex gap-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <motion.span
                              key={i}
                              className="h-3 w-3 bg-laser"
                              animate={{ opacity: [0.2, 1, 0.2] }}
                              transition={{ duration: 1, repeat: Infinity, delay: i * 0.12 }}
                            />
                          ))}
                        </div>
                        <span className="font-mono-tech text-[11px] uppercase tracking-widest text-foreground/60">
                          ▸ generating visual concept board…
                        </span>
                      </div>
                    ) : moodImages.length ? (
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {moodImages.map((img, i) => (
                          <SprocketFrame key={i} label={`Concept ${i + 1} · Scene ${img.scene_number}`}>
                            <div className="aspect-[4/3] overflow-hidden border-2 border-foreground">
                              <Image src={img.url} alt={img.title} fittingType="fill" className="h-full w-full" />
                            </div>
                            <p className="mt-2 font-mono-tech text-[10px] uppercase tracking-widest text-laser">
                              {img.title}
                            </p>
                          </SprocketFrame>
                        ))}
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-foreground/40 py-12 text-center">
                        <p className="font-mono-tech text-[11px] uppercase tracking-widest text-foreground/40">
                          Visual concept board generates after analysis.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </div>
    </section>
  );
}
