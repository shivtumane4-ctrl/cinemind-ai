import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

export default async function(req) {
  try {
    let body = {};
    try { body = await req.json(); } catch (_) { body = {}; }
    const prompts = Array.isArray(body?.image_prompts) ? body.image_prompts : [];
    if (!prompts.length) return Response.json({ error: "image_prompts is required" }, { status: 400 });

    const base44 = createClientFromRequest(req);
    const limited = prompts.slice(0, 6);

    const results = await Promise.all(limited.map(async (p) => {
      try {
        const fullPrompt = `Cinematic film concept art, visual development board. ${p.prompt}. Atmospheric, high detail, professional cinematography, 35mm film aesthetic, no text, no lettering, no watermark.`;
        const res = await base44.asServiceRole.integrations.Core.GenerateImage({ prompt: fullPrompt });
        return { scene_number: p.scene_number, title: p.title, url: res?.url || null };
      } catch (e) {
        return { scene_number: p.scene_number, title: p.title, url: null, error: e?.message || "generation failed" };
      }
    }));

    return Response.json({ images: results.filter((r) => r.url) });
  } catch (error) {
    console.error("GenerateMoodBoard error:", error);
    return Response.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}
