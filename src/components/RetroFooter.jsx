import React from "react";

export default function RetroFooter() {
  return (
    <footer className="relative px-5 py-12 md:px-8">
      <div className="rainbow-strip mb-8 h-1.5 w-full" />
      <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-8 md:flex-row">
        <div>
          <span className="red-tag text-xl tracking-tight">CineMind AI</span>
          <p className="mt-3 max-w-xs">
            <span className="red-tag text-[10px] leading-relaxed">
              Film production intelligence, plugged into the future. Drop a
              script, pull a reel.
            </span>
          </p>
        </div>
        <div className="flex flex-wrap gap-12">
          <div>
            <p>
              <span className="red-tag text-[10px]">Enquiries</span>
            </p>
            <a href="mailto:hello@cinemind.ai" className="mt-2 block">
              <span className="red-tag text-xs">hello@cinemind.ai</span>
            </a>
          </div>
          <div>
            <p>
              <span className="red-tag text-[10px]">Social</span>
            </p>
            <ul className="mt-2 space-y-2">
              <li>
                <a
                  href="https://www.linkedin.com/in/shiv-tumane-041330420/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="red-tag text-xs">LinkedIn ↗</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 flex max-w-5xl flex-wrap items-center justify-between gap-2 border-t-2 border-foreground pt-4">
        <span className="red-tag text-[10px]">
          © {new Date().getFullYear()} CineMind AI — All Rights Reserved
        </span>
        <span className="red-tag text-[10px]">
          Powered by Gemini · Multi-Agent Engine
        </span>
      </div>
    </footer>
  );
}
