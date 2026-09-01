const SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string", description: "Working title inferred from the script" },
    logline: { type: "string", description: "One-sentence logline" },
    genre: { type: "string" },
    scenes: {
      type: "array",
      items: {
        type: "object",
        properties: {
          number: { type: "integer" },
          slug: { type: "string", description: "Scene heading e.g. INT. WAREHOUSE - NIGHT" },
          setting: { type: "string" },
          description: { type: "string", description: "What happens in the scene" },
          estimated_minutes: { type: "number", description: "Estimated screen minutes" }
        },
        required: ["number", "slug", "setting", "description", "estimated_minutes"]
      }
    },
    budget: {
      type: "array",
      items: {
        type: "object",
        properties: {
          category: { type: "string" },
          detail: { type: "string" },
          amount_usd: { type: "number" }
        },
        required: ["category", "detail", "amount_usd"]
      }
    },
    casting: {
      type: "array",
      items: {
        type: "object",
        properties: {
          role: { type: "string" },
          description: { type: "string" },
          archetype: { type: "string" },
          suggested_actor: { type: "string" }
        },
        required: ["role", "description", "archetype", "suggested_actor"]
      }
    },
    total_budget_usd: { type: "number", description: "Sum of budget line items" },
    estimated_budget_usd: { type: "number", description: "Realistic total budget the script actually requires to be produced properly, independent of the user's budget" },
    budget_assessment: {
      type: "object",
      properties: {
        user_budget_usd: { type: "number" },
        estimated_budget_usd: { type: "number" },
        variance_usd: { type: "number", description: "estimated_budget_usd minus user_budget_usd (negative = under budget)" },
        status: { type: "string", enum: ["under_budget", "within_budget", "over_budget"] },
        note: { type: "string", description: "Concise explanation of the gap and what to adjust" }
      },
      required: ["user_budget_usd", "estimated_budget_usd", "variance_usd", "status", "note"]
    },
    image_prompts: {
      type: "array",
      description: "Vivid cinematic image-generation prompts for the most visually striking key scenes",
      items: {
        type: "object",
        properties: {
          scene_number: { type: "integer" },
          title: { type: "string", description: "Short label for the concept" },
          prompt: { type: "string", description: "Detailed cinematic image generation prompt: lighting, composition, mood, color palette, cinematic style for a visual concept board. No text or lettering." }
        },
        required: ["scene_number", "title", "prompt"]
      }
    }
  },
  required: ["title", "logline", "genre", "scenes", "budget", "casting", "total_budget_usd", "estimated_budget_usd", "budget_assessment", "image_prompts"]
};

const MODEL_CANDIDATES = ["gemini-3.6-flash", "gemini-3.5-flash", "gemini-2.5-flash"];

async function callGemini(script, model, userBudget) {
  const apiKey = process.env.GEMINI_API_KEY;
  const prompt = `You are CineMind AI, a film-production analysis engine. Read the screenplay below and produce a structured production brief.

The user has a production budget of $${userBudget.toLocaleString()}. 

STEP 1 — ESTIMATE: First, estimate the realistic total budget this script actually requires to be produced properly (estimated_budget_usd), completely independent of the user's budget. Base this on the script's scale: number of locations, cast size, VFX complexity, period/genre, stunts, etc.

STEP 2 — COMPARE: Compare estimated_budget_usd to the user's budget ($${userBudget.toLocaleString()}):
- status = "under_budget" if estimated is less than or equal to the user's budget
- status = "within_budget" if estimated is within 15% above the user's budget
- status = "over_budget" if estimated exceeds the user's budget by more than 15%
- variance_usd = estimated_budget_usd - user_budget_usd
- note: concisely explain the gap and what the producer should adjust (cut locations, reduce VFX, cast tier, etc.)

STEP 3 — BREAKDOWN: Produce a scene breakdown (slug, setting, description, estimated screen minutes), a budget allocation across production departments in USD scaled to the estimated budget, and casting cards (role, description, archetype, a suggested real actor) scaled to the estimated budget.

STEP 4 — MOOD BOARD: Generate exactly 6 vivid, cinematic image-generation prompts for the most visually striking key scenes (image_prompts). Each prompt should describe lighting, composition, mood, color palette, and cinematic style as if briefing a concept artist for a visual concept board. Do NOT mention text, lettering, or watermarks.

Return only the JSON matching the schema.

SCREENPLAY:
"""${script}"""`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: SCHEMA,
          temperature: 0.5
        }
      })
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini ${model} ${res.status}: ${errText.slice(0, 200)}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error(`Gemini ${model} returned no content`);
  return JSON.parse(text);
}

export default async function(req) {
  try {
    let body = {};
    try { body = await req.json(); } catch (_) { body = {}; }
    const script = (body && typeof body.script === "string" ? body.script : "").trim();
    if (!script) return Response.json({ error: "Script is required" }, { status: 400 });
    if (script.length > 20000) return Response.json({ error: "Script too long (max 20000 chars)" }, { status: 400 });

    const rawBudget = Number(body && body.userBudget);
    const userBudget = Number.isFinite(rawBudget) && rawBudget > 0 ? Math.round(rawBudget) : 10000000;

    let analysis = null;
    let lastError = null;
    for (const model of MODEL_CANDIDATES) {
      try {
        analysis = await callGemini(script, model, userBudget);
        break;
      } catch (e) {
        lastError = e;
        console.warn(`Model ${model} failed:`, e?.message);
      }
    }

    if (!analysis) {
      return Response.json(
        { error: lastError?.message || "All Gemini models failed" },
        { status: 502 }
      );
    }

    return Response.json({ analysis });
  } catch (error) {
    console.error("AnalyzeScript error:", error);
    return Response.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}
