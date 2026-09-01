# cinemind-ai
AI-powered film production intelligence platform driven by Gemini 3.6 Flash. Features dynamic budget scaling, 3D WebGL reel cards, and PDF production binder export.
# CineMind AI

**CineMind AI** is a film production intelligence platform powered by **Google's Gemini 3.6 Flash**. It transforms raw screenplays into structured production reels—generating scene breakdowns, budget allocations, casting cards, and downloadable PDF call sheets projected onto a dynamic 3D WebGL film cylinder.

## Key Features
Multi-Agent Script Parsing: Uses `gemini-3.6-flash` to extract structured JSON data including scenes, characters, lighting cues, and prop budgets.
Dynamic Budget Tier Scaling: Recalculates visual effects scope, practical locations, and casting archetypes relative to selected budget tiers.
3D WebGL Film Strip Interface: Renders real-time dynamic output cards onto an interactive 3D rotating film strip.
PDF Production Binder Export: Exports a single-click official production call sheet PDF for line producers and filmmakers.

## Tech Stack
AI Model: Google Gemini API (`gemini-3.6-flash`)
Frontend:** React, Tailwind CSS, Three.js / WebGL
Export Utilities: jsPDF / html2pdf.js
Platform: Base44 Platform Engine
