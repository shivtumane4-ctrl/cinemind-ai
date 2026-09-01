import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";

const IMAGES = [
  "https://media.base44.com/images/public/6a91327861eb57937e12931d/86c95ff09_generated_image.png",
  "https://media.base44.com/images/public/6a91327861eb57937e12931d/cef629560_generated_image.png",
  "https://media.base44.com/images/public/6a91327861eb57937e12931d/bb4a1cf15_generated_image.png",
  "https://media.base44.com/images/public/6a91327861eb57937e12931d/4462db51d_generated_image.png",
  "https://media.base44.com/images/public/6a91327861eb57937e12931d/5e99781a4_generated_314a71d1.png",
  "https://media.base44.com/images/public/6a91327861eb57937e12931d/51c913db2_generated_68a3971a.png",
  "https://media.base44.com/images/public/6a91327861eb57937e12931d/d339cf3ea_generated_c2f8964b.png",
  "https://media.base44.com/images/public/6a91327861eb57937e12931d/287fefa38_generated_a0271d2e.png",
];

const N = 10;
const R = 6.2;
const FW = 2.4;
const FH = 3.25;

const VERT = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// CRT: chromatic aberration + scanlines + vignette + grain
const CRT_FRAG = `
uniform sampler2D tDiffuse;
uniform float uTime;
varying vec2 vUv;
float rand(vec2 co){ return fract(sin(dot(co, vec2(12.9898,78.233))) * 43758.5453); }
void main() {
  vec2 uv = vUv;
  float ca = 0.0022;
  vec4 col;
  col.r = texture2D(tDiffuse, uv + vec2(ca, 0.0)).r;
  col.g = texture2D(tDiffuse, uv).g;
  col.b = texture2D(tDiffuse, uv - vec2(ca, 0.0)).b;
  col.a = texture2D(tDiffuse, uv).a;
  float scan = sin(uv.y * 900.0) * 0.05;
  col.rgb -= scan;
  vec2 d = uv - 0.5;
  col.rgb *= smoothstep(0.8, 0.32, length(d));
  float g = rand(uv * (uTime + 1.0)) - 0.5;
  col.rgb += g * 0.07;
  gl_FragColor = col;
}
`;

// Sine-wave liquid shredder: vertical sine offset -> liquid ribbons
const SHRED_FRAG = `
uniform sampler2D tDiffuse;
uniform float uTime;
uniform float uIntensity;
varying vec2 vUv;
void main() {
  vec2 uv = vUv;
  float wave = sin(uv.y * 28.0 + uTime * 3.0) * 0.035 * uIntensity;
  uv.x += wave;
  uv.y += sin(uv.x * 18.0 + uTime * 2.0) * 0.012 * uIntensity;
  gl_FragColor = texture2D(tDiffuse, uv);
}
`;

// Paper-curl / page-peel: curls the right edge inward with shading
const PEEL_FRAG = `
uniform sampler2D tDiffuse;
uniform float uProgress;
varying vec2 vUv;
void main() {
  vec2 uv = vUv;
  float peel = clamp(uProgress, 0.0, 1.0);
  float edge = 1.0 - peel;
  if (uv.x <= edge) {
    gl_FragColor = texture2D(tDiffuse, uv);
  } else {
    float t = (uv.x - edge) / max(peel, 0.001);
    float angle = t * 3.14159;
    float sx = edge + (1.0 - cos(angle)) * peel * 0.5;
    vec4 col = texture2D(tDiffuse, vec2(sx, uv.y));
    float shade = 0.5 + 0.5 * (1.0 - sin(angle));
    col.rgb *= shade;
    if (angle > 1.5708) col.rgb = col.rgb * 0.35 + 0.12;
    gl_FragColor = col;
  }
}
`;

function wrap(ctx, text, maxWidth) {
  const words = String(text).split(" ");
  const lines = [];
  let line = "";
  for (const w of words) {
    const test = line ? line + " " + w : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawAnalysisTexture(label, items, title) {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 683;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#F3EFE6";
  ctx.fillRect(0, 0, 512, 683);
  ctx.strokeStyle = "#111111";
  ctx.lineWidth = 10;
  ctx.strokeRect(5, 5, 502, 673);

  // header bar
  ctx.fillStyle = "#111111";
  ctx.fillRect(20, 20, 472, 50);
  ctx.fillStyle = "#F3EFE6";
  ctx.font = "bold 20px 'JetBrains Mono', monospace";
  ctx.textBaseline = "middle";
  ctx.fillText(label, 36, 46);

  // rainbow strip
  const cols = ["#E63946", "#F4A261", "#E9C46A", "#2A9D8F", "#264653", "#6A4C93"];
  cols.forEach((col, i) => {
    ctx.fillStyle = col;
    ctx.fillRect(20 + i * 78.6, 74, 78.6, 6);
  });

  // title
  ctx.fillStyle = "#111111";
  ctx.font = "bold 24px Georgia, serif";
  ctx.textBaseline = "alphabetic";
  const titleLines = wrap(ctx, title || "Untitled", 460);
  let y = 116;
  titleLines.slice(0, 2).forEach((ln) => {
    ctx.fillText(ln, 28, y);
    y += 28;
  });
  y += 8;

  // items
  ctx.font = "15px 'JetBrains Mono', monospace";
  for (const it of items) {
    if (y > 630) break;
    const lines = wrap(ctx, it, 456);
    for (const ln of lines) {
      if (y > 630) break;
      ctx.fillStyle = "#111111";
      ctx.fillText(ln, 28, y);
      y += 21;
    }
    y += 8;
  }

  // footer
  ctx.fillStyle = "#111111";
  ctx.font = "11px 'JetBrains Mono', monospace";
  ctx.fillText("CineMind AI · Multi-Agent Engine", 28, 660);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function buildAnalysisTextures(analysis) {
  const a = analysis || {};
  const sceneItems = (a.scenes || []).map(
    (s) => `${s.number}. ${s.slug} · ${s.estimated_minutes}m — ${s.description}`
  );
  const budgetItems = (a.budget || []).map(
    (b) => `${b.category}: $${Number(b.amount_usd).toLocaleString()} — ${b.detail}`
  );
  if (a.total_budget_usd) budgetItems.push(`TOTAL: $${Number(a.total_budget_usd).toLocaleString()}`);
  const castItems = (a.casting || []).map(
    (c) => `${c.role} (${c.archetype}) — ${c.suggested_actor}. ${c.description}`
  );
  return [
    drawAnalysisTexture("SCENE BREAKDOWN", sceneItems, a.title),
    drawAnalysisTexture("BUDGET ALLOCATIONS", budgetItems, a.title),
    drawAnalysisTexture("CASTING CARDS", castItems, a.title),
  ];
}

function makeSprocketTexture() {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 128;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#111111";
  ctx.fillRect(0, 0, 256, 128);
  ctx.fillStyle = "#F3EFE6";
  for (let x = 10; x < 256; x += 26) {
    ctx.fillRect(x, 8, 13, 15);
    ctx.fillRect(x, 128 - 23, 13, 15);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.repeat.set(N, 1);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export default function WebGLStage({ analysis, moodImages = [] }) {
  const canvasRef = useRef(null);
  const frameMatsRef = useRef([]);
  const analysisRef = useRef(analysis);
  analysisRef.current = analysis;

  useEffect(() => {
    const canvas = canvasRef.current;
    const w = window.innerWidth;
    const h = window.innerHeight;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.setClearColor(0xf3efe6, 1);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(44, w / h, 0.1, 100);
    camera.position.set(0, 0.6, R + 6.4);
    camera.lookAt(0, 0, 0);

    const group = new THREE.Group();
    scene.add(group);

    // cylindrical film-strip band
    const band = new THREE.Mesh(
      new THREE.CylinderGeometry(R, R, 4.6, N, 1, true),
      new THREE.MeshBasicMaterial({ map: makeSprocketTexture(), side: THREE.DoubleSide })
    );
    group.add(band);

    // frame planes on the cylinder surface
    const loader = new THREE.TextureLoader();
    const mats = [];
    for (let i = 0; i < N; i++) {
      const angle = (i / N) * Math.PI * 2;
      const frame = new THREE.Group();

      const back = new THREE.Mesh(
        new THREE.PlaneGeometry(FW + 0.16, FH + 0.16),
        new THREE.MeshBasicMaterial({ color: 0x111111 })
      );
      back.position.z = -0.02;
      frame.add(back);

      const tex = loader.load(IMAGES[i % IMAGES.length], (t) => {
        t.colorSpace = THREE.SRGBColorSpace;
      });
      const mat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide });
      mats.push(mat);
      const img = new THREE.Mesh(new THREE.PlaneGeometry(FW, FH), mat);
      frame.add(img);

      frame.position.set(Math.sin(angle) * (R + 0.06), 0, Math.cos(angle) * (R + 0.06));
      frame.rotation.y = angle;
      group.add(frame);
    }
    frameMatsRef.current = mats;

    // post-processing
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    const peelPass = new ShaderPass({
      uniforms: { tDiffuse: { value: null }, uProgress: { value: 0 } },
      vertexShader: VERT,
      fragmentShader: PEEL_FRAG,
    });
    composer.addPass(peelPass);

    const shredPass = new ShaderPass({
      uniforms: { tDiffuse: { value: null }, uTime: { value: 0 }, uIntensity: { value: 0 } },
      vertexShader: VERT,
      fragmentShader: SHRED_FRAG,
    });
    composer.addPass(shredPass);

    const crtPass = new ShaderPass({
      uniforms: { tDiffuse: { value: null }, uTime: { value: 0 } },
      vertexShader: VERT,
      fragmentShader: CRT_FRAG,
    });
    crtPass.renderToScreen = true;
    composer.addPass(crtPass);

    // interaction state
    let targetRot = 0;
    let currentRot = 0;
    let dragAccum = 0;
    let idleAccum = 0;
    let dragging = false;
    let lastX = 0;
    let lastScroll = window.scrollY;
    let scrollVel = 0;
    let hoverTarget = 0;
    let hoverCurrent = 0;
    let shredCurrent = 0;

    const onDown = (e) => {
      if (e.pointerType !== "mouse") return;
      dragging = true;
      lastX = e.clientX;
    };
    const onMove = (e) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      dragAccum += dx * 0.005;
    };
    const onUp = () => { dragging = false; };
    const onEnter = () => { hoverTarget = 0.7; };
    const onLeave = () => { hoverTarget = 0; };

    canvas.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointerenter", onEnter);
    canvas.addEventListener("pointerleave", onLeave);

    const onResize = () => {
      const ww = window.innerWidth;
      const hh = window.innerHeight;
      camera.aspect = ww / hh;
      camera.updateProjectionMatrix();
      renderer.setSize(ww, hh);
      composer.setSize(ww, hh);
    };
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();
    let raf;
    const tick = () => {
      const t = clock.getElapsedTime();
      const sy = window.scrollY;
      scrollVel = sy - lastScroll;
      lastScroll = sy;

      idleAccum += 0.0011;
      targetRot = sy * 0.0022 + dragAccum + idleAccum;
      currentRot += (targetRot - currentRot) * 0.06;
      group.rotation.y = currentRot;

      const velI = Math.min(Math.abs(scrollVel) * 0.015, 1);
      shredCurrent += (velI - shredCurrent) * 0.1;
      scrollVel *= 0.9;
      hoverCurrent += (hoverTarget - hoverCurrent) * 0.08;
      shredPass.uniforms.uIntensity.value = Math.min(shredCurrent + hoverCurrent, 1);
      shredPass.uniforms.uTime.value = t;

      const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
      peelPass.uniforms.uProgress.value = Math.min(sy / maxScroll, 1) * 0.35;

      crtPass.uniforms.uTime.value = t;
      composer.render();
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointerenter", onEnter);
      canvas.removeEventListener("pointerleave", onLeave);
      composer.dispose();
      renderer.dispose();
    };
  }, []);

  // feed analysis JSON into dynamic Three.js texture maps on the film strip
  useEffect(() => {
    const mats = frameMatsRef.current;
    if (!mats.length || !analysis) return;
    const textures = buildAnalysisTextures(analysis);
    textures.forEach((tex, i) => {
      if (mats[i]) {
        mats[i].map = tex;
        mats[i].needsUpdate = true;
      }
    });
  }, [analysis]);

  // project mood board concept images onto the reel frames
  useEffect(() => {
    const mats = frameMatsRef.current;
    if (!mats.length || !moodImages.length) return;
    const loader = new THREE.TextureLoader();
    moodImages.forEach((img, i) => {
      if (mats[i] && img.url) {
        loader.load(img.url, (t) => {
          t.colorSpace = THREE.SRGBColorSpace;
          mats[i].map = t;
          mats[i].needsUpdate = true;
        });
      }
    });
  }, [moodImages]);

  return (
    <canvas
      id="webgl-stage"
      ref={canvasRef}
      className="fixed inset-0 h-full w-full"
      style={{ zIndex: 0, touchAction: "pan-y" }}
    />
  );
}
