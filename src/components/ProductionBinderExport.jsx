import React from "react";
import { jsPDF } from "jspdf";

export default function ProductionBinderExport({ analysis }) {
  const handleExport = () => {
    const a = analysis;
    if (!a) return;

    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 48;
    let y = 88;

    // Header band
    doc.setFillColor(17, 17, 17);
    doc.rect(0, 0, pageW, 64, "F");
    doc.setTextColor(245, 245, 247);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.text("CINEMIND AI // OFFICIAL PRODUCTION BINDER", margin, 30);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(new Date().toLocaleString(), margin, 46);
    doc.setTextColor(255, 51, 0);
    doc.setFont("helvetica", "bold");
    doc.text("CONFIDENTIAL", pageW - margin, 30, { align: "right" });

    const sectionHeader = (label) => {
      if (y > pageH - 60) { doc.addPage(); y = margin; }
      doc.setFillColor(17, 17, 17);
      doc.rect(margin, y - 12, pageW - margin * 2, 24, "F");
      doc.setTextColor(245, 245, 247);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text(label, margin + 8, y + 4);
      y += 28;
    };

    // Title block
    doc.setTextColor(17, 17, 17);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text(a.title || "Untitled", margin, y);
    y += 18;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(120, 120, 120);
    doc.text(a.genre || "", margin, y);
    y += 24;

    doc.setTextColor(17, 17, 17);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(12);
    const logLines = doc.splitTextToSize(a.logline || "", pageW - margin * 2);
    doc.text(logLines, margin, y);
    y += logLines.length * 16 + 24;

    // Scenes
    sectionHeader("SCENE BREAKDOWN");
    doc.setTextColor(17, 17, 17);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    (a.scenes || []).forEach((s) => {
      if (y > pageH - margin) { doc.addPage(); y = margin; }
      doc.setFont("helvetica", "bold");
      doc.text(`${s.number}. ${s.slug}`, margin, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(255, 51, 0);
      doc.text(`~${s.estimated_minutes} min`, pageW - margin, y, { align: "right" });
      doc.setTextColor(17, 17, 17);
      y += 14;
      const desc = doc.splitTextToSize(s.description || "", pageW - margin * 2);
      doc.text(desc, margin, y);
      y += desc.length * 13 + 14;
    });
    y += 12;

    // Budget
    sectionHeader("BUDGET ALLOCATIONS");
    doc.setTextColor(17, 17, 17);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    (a.budget || []).forEach((b) => {
      if (y > pageH - margin) { doc.addPage(); y = margin; }
      doc.setFont("helvetica", "bold");
      doc.text(b.category, margin, y);
      doc.setFont("helvetica", "normal");
      doc.text(`$${Number(b.amount_usd).toLocaleString()}`, pageW - margin, y, { align: "right" });
      y += 13;
      const det = doc.splitTextToSize(b.detail || "", pageW - margin * 2);
      doc.setTextColor(120, 120, 120);
      doc.text(det, margin, y);
      doc.setTextColor(17, 17, 17);
      y += det.length * 12 + 10;
    });
    y += 6;
    doc.setDrawColor(17, 17, 17);
    doc.line(margin, y, pageW - margin, y);
    y += 18;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("TOTAL", margin, y);
    doc.setTextColor(255, 51, 0);
    doc.text(`$${Number(a.total_budget_usd || 0).toLocaleString()}`, pageW - margin, y, { align: "right" });
    y += 28;

    // Casting
    sectionHeader("CASTING CARDS");
    doc.setTextColor(17, 17, 17);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    (a.casting || []).forEach((c) => {
      if (y > pageH - 80) { doc.addPage(); y = margin; }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text(c.role, margin, y);
      y += 16;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(255, 51, 0);
      doc.text(c.archetype || "", margin, y);
      doc.setTextColor(17, 17, 17);
      y += 14;
      const desc = doc.splitTextToSize(c.description || "", pageW - margin * 2);
      doc.text(desc, margin, y);
      y += desc.length * 13 + 6;
      doc.setFont("helvetica", "italic");
      doc.text(`Suggested: ${c.suggested_actor}`, margin, y);
      doc.setFont("helvetica", "normal");
      y += 20;
    });

    doc.save(`CineMind_Binder_${(a.title || "script").replace(/\s+/g, "_")}.pdf`);
  };

  return (
    <button
      onClick={handleExport}
      disabled={!analysis}
      className="border-2 border-laser bg-laser/10 px-4 py-2.5 font-mono-tech text-[10px] uppercase tracking-widest text-laser transition-all enabled:hover:bg-laser enabled:hover:text-background disabled:opacity-40"
      style={{ boxShadow: "0 0 16px rgba(255,51,0,0.45)" }}
    >
      ▸ Export Production Binder (.PDF)
    </button>
  );
}
