import React from "react";

export default function PrintAdCTA() {
  return (
    <section id="consult" className="relative px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-3xl">
        <div className="rainbow-strip h-2 w-full" />
        <div
          className="border-2 border-foreground bg-foreground p-8 text-background md:p-12"
          style={{ boxShadow: "10px 10px 0 0 hsl(var(--foreground))" }}
        >
          <div className="flex items-center justify-between border-b-2 border-dashed border-background pb-3">
            <span className="font-mono-tech text-[10px] uppercase tracking-widest text-background/60">
              CINEMIND AI · COUPON · NO. 042
            </span>
            <span className="font-mono-tech text-[10px] uppercase tracking-widest text-laser">
              ★ Act Now!
            </span>
          </div>

          <h2 className="mt-6 font-heading text-5xl leading-[0.95] tracking-tight md:text-6xl">
            Book a <span className="text-laser italic">Consultation</span>
          </h2>
          <p className="mt-4 max-w-lg font-body text-base leading-relaxed text-background/70">
            Cut this coupon from your screen and bring it in. One free
            script-to-reel breakdown with our creative engineers.
          </p>

          <div className="mt-8 grid gap-4 border-2 border-dashed border-background p-5 md:grid-cols-2 md:items-center">
            <div>
              <p className="font-mono-tech text-[10px] uppercase tracking-widest text-background/50">
                ✂ cut here — present at counter
              </p>
              <p className="mt-2 font-heading text-2xl tracking-tight">
                Free First Breakdown
              </p>
              <p className="font-mono-tech text-[11px] uppercase tracking-widest text-background/60">
                scenes · budget · casting
              </p>
            </div>
            <div className="flex flex-col gap-3 md:items-end">
              <a
                href="https://cal.com/simon-hedlund-kglzne"
                target="_blank"
                rel="noreferrer"
                className="border-2 border-background bg-laser px-5 py-3 font-mono-tech text-[11px] uppercase tracking-widest text-background transition-transform hover:-translate-y-0.5 hover:translate-x-0.5"
              >
                ▸ Book a Call Today
              </a>
              <a
                href="mailto:hello@cinemind.ai"
                className="font-mono-tech text-[11px] uppercase tracking-widest text-background/70 hover:text-laser"
              >
                hello@cinemind.ai ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
