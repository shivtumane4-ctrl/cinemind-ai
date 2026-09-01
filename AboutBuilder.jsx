import React from "react";

export default function AboutBuilder() {
  return (
    <section id="partners" className="relative px-5 py-20 md:px-8 md:py-28">
      <div
        className="mx-auto max-w-3xl border-2 border-foreground bg-background/85 p-6 backdrop-blur-md md:p-10"
        style={{ boxShadow: "8px 8px 0 0 hsl(var(--foreground))" }}
      >
        <div className="mb-6 flex items-center justify-between border-b-2 border-dashed border-foreground pb-3">
          <span className="font-mono-tech text-[10px] uppercase tracking-widest text-foreground/60">
            CINEMIND AI · EDITORIAL · NO. 042
          </span>
          <span className="font-mono-tech text-[10px] uppercase tracking-widest text-laser">
            ★ About
          </span>
        </div>

        <span className="font-mono-tech text-[10px] uppercase tracking-widest text-laser">
          §03 — About the Builder
        </span>
        <h2 className="mt-2 font-heading text-5xl leading-none tracking-tight md:text-6xl">
          About the Builder
        </h2>

        <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-start">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center border-2 border-foreground bg-foreground font-heading text-5xl text-background">
            ST
          </div>
          <div className="flex-1">
            <h3 className="font-heading text-3xl tracking-tight md:text-4xl">
              Shiv Tumane
            </h3>
            <p className="mt-1 font-mono-tech text-[11px] uppercase tracking-widest text-laser">
              AS Level Student · Aspiring Economist &amp; Data Scientist
            </p>
            <p className="mt-4 border-l-2 border-foreground pl-4 font-heading text-xl italic leading-relaxed text-foreground/80 md:text-2xl">
              "Building next-generation AI orchestration tools at the
              intersection of media, data science, and economic planning."
            </p>
            <a
              href="https://www.linkedin.com/in/shiv-tumane-041330420/"
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-block border-2 border-foreground bg-laser px-5 py-3 font-mono-tech text-[11px] uppercase tracking-widest text-background transition-transform hover:-translate-y-0.5 hover:translate-x-0.5"
            >
              Connect on LinkedIn →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
