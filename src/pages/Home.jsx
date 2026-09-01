import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import WebGLStage from "@/components/WebGLStage";
import RetroHeader from "@/components/RetroHeader";
import ShredText from "@/components/ShredText";
import ScriptTerminal from "@/components/ScriptTerminal";
import ProductionOutput from "@/components/ProductionOutput";
import AboutBuilder from "@/components/AboutBuilder";
import PrintAdCTA from "@/components/PrintAdCTA";
import RetroFooter from "@/components/RetroFooter";

export default function Home() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [moodImages, setMoodImages] = useState([]);
  const [moodLoading, setMoodLoading] = useState(false);

  const handleAnalyze = async (script, userBudget) => {
    if (!script.trim()) return;
    setLoading(true);
    setError("");
    setAnalysis(null);
    setMoodImages([]);
    try {
      const res = await base44.functions.invoke("AnalyzeScript", { script, userBudget });
      setAnalysis(res.data.analysis);
      setTimeout(() => {
        document.getElementById("output")?.scrollIntoView({ behavior: "smooth" });
      }, 250);

      if (res.data.analysis?.image_prompts?.length) {
        setMoodLoading(true);
        try {
          const mb = await base44.functions.invoke("GenerateMoodBoard", {
            image_prompts: res.data.analysis.image_prompts,
          });
          setMoodImages(mb.data.images || []);
        } catch (me) {
          console.warn("Mood board failed:", me?.message);
        } finally {
          setMoodLoading(false);
        }
      }
    } catch (e) {
      const detail = e?.response?.data?.detail || e?.response?.data?.error;
      setError(detail ? `${e.response.status}: ${String(detail).slice(0, 120)}` : (e?.message || "Analysis failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full">
      <RetroHeader />
      <WebGLStage analysis={analysis} moodImages={moodImages} />

      {/* hero overlay — transparent so the 3D reel + drag pass through */}
      <section
        id="hero"
        className="pointer-events-none relative flex min-h-[92vh] flex-col items-center justify-center px-6 text-center"
        style={{ zIndex: 10 }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(8,8,12,0.78) 0%, rgba(8,8,12,0.5) 42%, rgba(8,8,12,0) 76%)",
          }}
        />
        <span className="relative mb-4 inline-block border border-white/10 bg-white/5 px-3 py-1 font-mono-tech text-[10px] uppercase tracking-widest text-[#D1D5DB] backdrop-blur">
          Film Production Intelligence · Gemini 2.5
        </span>
        <h1 className="relative font-heading text-[15vw] leading-[0.82] tracking-tight md:text-[8.5vw]">
          <ShredText className="hero-glow text-[#F5F5F7]">CineMind</ShredText>
          <br />
          <span className="hero-glow text-laser italic">AI</span>
        </h1>
        <p className="relative mt-5 max-w-xl font-body text-base font-medium leading-relaxed text-[#E5E7EB] md:text-lg">
          Drop a screenplay. Pull a full production reel — scene breakdowns,
          budget allocations, and casting cards — projected onto a real 3D WebGL
          film-strip cylinder.
        </p>
        <span className="relative mt-8 font-mono-tech text-[10px] uppercase tracking-widest text-[#D1D5DB]/70">
          ◂ drag the reel · scroll to rotate ▸
        </span>
      </section>

      <main className="relative" style={{ zIndex: 10 }}>
        <ScriptTerminal onAnalyze={handleAnalyze} loading={loading} error={error} />
        <ProductionOutput analysis={analysis} loading={loading} moodImages={moodImages} moodLoading={moodLoading} />
        <AboutBuilder />
        <PrintAdCTA />
      </main>

      <div className="relative" style={{ zIndex: 10 }}>
        <RetroFooter />
      </div>
    </div>
  );
}
