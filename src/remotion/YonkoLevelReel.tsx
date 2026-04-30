import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";

const W = 1920;
const H = 1080;

// Group 531 is exported as a single design board and optimized to 5600 × 4014
// for the reel so the repo does not carry the 38MB source PNG.
const CANVAS_W = 5600;
const CANVAS_H = 4014;

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

/**
 * Fixed overhead camera. `x`/`y` are coordinates on the single printed board
 * placed under the lens. Each segment is a straight newspaper drag with
 * ease-out, preserving the physical camera setup.
 */
const beats = [
  { f: 0, x: 760, y: 620, z: 1.06 },
  { f: 26, x: 2050, y: 620, z: 1.82 }, // horizontal scan
  { f: 56, x: 2050, y: 1540, z: 2.7 }, // vertical macro detail
  { f: 86, x: 3560, y: 2320, z: 1.72 }, // diagonal drag
  { f: 116, x: 4670, y: 2320, z: 2.42 }, // horizontal close-up
  { f: 146, x: 4670, y: 1080, z: 1.62 }, // vertical pull up
  { f: 176, x: 3040, y: 1080, z: 2.35 }, // horizontal pull back
  { f: 208, x: 1440, y: 2860, z: 1.9 }, // diagonal down-left
  { f: 240, x: 1440, y: 3320, z: 3.05 }, // macro detail
  { f: 272, x: 3440, y: 3320, z: 1.78 }, // long horizontal drag
  { f: 308, x: 2800, y: 2000, z: 0.54 }, // full-board reveal
  { f: 360, x: 760, y: 620, z: 1.06 },
];

function valueAt(frame: number, key: "x" | "y" | "z") {
  const endIndex = beats.findIndex((beat) => beat.f >= frame);
  const safeEndIndex = Math.max(1, endIndex === -1 ? beats.length - 1 : endIndex);
  const start = beats[safeEndIndex - 1];
  const end = beats[safeEndIndex];
  const progress = clamp01((frame - start.f) / (end.f - start.f));
  return interpolate(easeOutCubic(progress), [0, 1], [start[key], end[key]]);
}

export function YonkoLevelReel() {
  const frame = useCurrentFrame();
  const targetX = valueAt(frame, "x");
  const targetY = valueAt(frame, "y");
  const zoom = valueAt(frame, "z");

  const handJitterX = Math.sin(frame * 0.83) * 2.2 + Math.sin(frame * 0.31) * 1.2;
  const handJitterY = Math.cos(frame * 0.71) * 2;
  const exposureFlicker = 0.032 + Math.sin(frame * 0.19) * 0.012;

  return (
    <div style={{ width: W, height: H, overflow: "hidden", background: "#d4d0c2" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: CANVAS_W,
          height: CANVAS_H,
          transform: `translate(${W / 2}px, ${H / 2}px) scale(${zoom}) translate(${-targetX + handJitterX}px, ${-targetY + handJitterY}px)`,
          transformOrigin: "0 0",
          willChange: "transform",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: -80,
            background: "#eee8d8",
            boxShadow: "0 26px 80px rgba(0,0,0,.24)",
          }}
        />
        <Img
          src={staticFile("/projects/yonko/group-531-reel.jpg")}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: CANVAS_W,
            height: CANVAS_H,
            objectFit: "cover",
            filter: "contrast(1.08) saturate(0.94)",
            mixBlendMode: "multiply",
          }}
        />
      </div>

      {/* Fixed camera surface treatment: print dots, lens falloff, tiny exposure changes. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle, rgba(0,0,0,.2) 0 0.65px, transparent 0.75px), radial-gradient(circle, rgba(254,106,90,.12) 0 0.55px, transparent 0.7px), radial-gradient(circle, rgba(49,125,172,.1) 0 0.55px, transparent 0.7px)",
          backgroundPosition: "0 0, 2px 1px, -2px 2px",
          backgroundSize: "5px 5px, 5px 5px, 5px 5px",
          mixBlendMode: "multiply",
          opacity: 0.2,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 50%, transparent 0 58%, rgba(0,0,0,.23) 100%), linear-gradient(90deg, rgba(255,0,0,.03), rgba(0,120,255,.022), rgba(255,205,0,.03))",
          mixBlendMode: "multiply",
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "absolute", inset: 0, background: `rgba(255,255,255,${exposureFlicker})`, pointerEvents: "none" }} />
    </div>
  );
}
