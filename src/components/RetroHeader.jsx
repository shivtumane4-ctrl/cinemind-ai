import React from "react";

const LINKS = [
  { label: "Reel", href: "#hero" },
  { label: "Terminal", href: "#terminal" },
  { label: "Output", href: "#output" },
  { label: "About", href: "#partners" },
];

export default function RetroHeader() {
  return (
    <header className="glass-dark sticky top-0 z-50 border-b border-white/10">
      <div className="flex items-center justify-between px-5 py-3 md:px-8">
        <a href="#hero" className="flex items-center gap-[10px]">
          <svg
            width="28"
            height="28"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ filter: "drop-shadow(0 0 10px rgba(255, 51, 0, 0.7))" }}
            aria-label="CineMind AI logo"
          >
            <circle cx="16" cy="16" r="14" stroke="#E5E7EB" strokeWidth="1.5" />
            <circle cx="16" cy="16" r="9.5" stroke="#E5E7EB" strokeWidth="1" opacity="0.45" />
            <path
              d="M24 16 L18 19.464 M20 22.928 L14 19.464 M12 22.928 L12 16 M8 16 L14 12.536 M12 9.072 L18 12.536 M20 9.072 L20 16"
              stroke="#E5E7EB"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <ellipse cx="16" cy="16" rx="11" ry="1.1" fill="#E5E7EB" opacity="0.5" />
            <circle cx="16" cy="16" r="3.8" fill="#FF3300" />
            <circle cx="16" cy="16" r="3.8" stroke="#FFFFFF" strokeWidth="1" />
          </svg>
          <span className="font-heading text-xl leading-none tracking-tight text-[#F5F5F7] md:text-2xl">
            CineMind<span className="ai-glow text-laser"> AI</span>
          </span>
        </a>
        <nav className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="font-mono-tech text-[11px] uppercase tracking-widest text-[#D1D5DB] transition-colors hover:text-[#FF7A00]"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href="#terminal"
          className="border border-[#FF7A00]/50 bg-[#FF7A00]/10 px-3 py-1.5 font-mono-tech text-[10px] uppercase tracking-widest text-[#FF7A00] transition-all hover:bg-gradient-to-r hover:from-[#FF7A00] hover:to-[#FFB020] hover:text-[#0a0a0f] md:px-4"
          style={{ boxShadow: "0 0 14px rgba(255,122,0,0.3)" }}
        >
          Try Console →
        </a>
      </div>
    </header>
  );
}
