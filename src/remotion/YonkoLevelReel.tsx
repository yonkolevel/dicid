import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";

const W = 1920;
const H = 1080;
const CANVAS_W = 3600;
const CANVAS_H = 2400;

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

/**
 * Fixed overhead camera. `x`/`y` are the canvas coordinates placed under the
 * lens. The canvas is dense and newspaper-like, so every drag lands on print.
 */
const beats = [
  { f: 0, x: 760, y: 520, z: 1.08 },
  { f: 28, x: 1580, y: 520, z: 1.9 }, // horizontal drag across hero/logo
  { f: 58, x: 1580, y: 1060, z: 2.65 }, // vertical macro into print detail
  { f: 88, x: 2380, y: 1500, z: 1.65 }, // diagonal drag to UI cluster
  { f: 118, x: 3000, y: 1500, z: 2.45 }, // horizontal detail scan
  { f: 150, x: 3000, y: 770, z: 1.75 }, // vertical drag up
  { f: 182, x: 2050, y: 770, z: 2.35 }, // horizontal pull through typography
  { f: 214, x: 980, y: 1640, z: 1.9 }, // diagonal to character / screen crop
  { f: 246, x: 980, y: 1960, z: 3.0 }, // macro pixel detail
  { f: 278, x: 2100, y: 1880, z: 1.75 }, // long horizontal drag
  { f: 312, x: 1810, y: 1220, z: 0.72 }, // reveal the dense board
  { f: 360, x: 760, y: 520, z: 1.08 },
];

const asset = (name: string) => staticFile(`/projects/yonko/reel-assets/${name}`);

function valueAt(frame: number, key: "x" | "y" | "z") {
  const endIndex = beats.findIndex((beat) => beat.f >= frame);
  const safeEndIndex = Math.max(1, endIndex === -1 ? beats.length - 1 : endIndex);
  const start = beats[safeEndIndex - 1];
  const end = beats[safeEndIndex];
  const progress = clamp01((frame - start.f) / (end.f - start.f));
  return interpolate(easeOutCubic(progress), [0, 1], [start[key], end[key]]);
}

function PrintedAsset({
  src,
  x,
  y,
  w,
  rotate = 0,
  z = 1,
  opacity = 1,
}: {
  src: string;
  x: number;
  y: number;
  w: number;
  rotate?: number;
  z?: number;
  opacity?: number;
}) {
  return (
    <Img
      src={asset(src)}
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: "auto",
        transform: `rotate(${rotate}deg)`,
        transformOrigin: "center center",
        filter: "contrast(1.1) saturate(0.92)",
        mixBlendMode: "multiply",
        opacity,
        zIndex: z,
      }}
    />
  );
}

function TextBlock({ x, y, w, lines = 12 }: { x: number; y: number; w: number; lines?: number }) {
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, zIndex: 4, opacity: 0.48 }}>
      {Array.from({ length: lines }).map((_, index) => (
        <span
          key={index}
          style={{
            display: "block",
            height: index % 5 === 0 ? 8 : 5,
            width: `${62 + ((index * 17) % 38)}%`,
            marginBottom: 8,
            background: "#000015",
          }}
        />
      ))}
    </div>
  );
}

function Headline({ children, x, y, size = 82 }: { children: string; x: number; y: number; size?: number }) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        maxWidth: 540,
        fontSize: size,
        lineHeight: 0.82,
        fontWeight: 950,
        letterSpacing: "-0.075em",
        color: "#000015",
        textTransform: "uppercase",
        zIndex: 35,
      }}
    >
      {children}
    </div>
  );
}

function RickySprite() {
  const frame = useCurrentFrame();
  const sprites = ["ricky_walk_right_1.png", "ricky_walk_right_2.png", "ricky_run_right_1.png", "ricky_run_right_2.png"];
  const src = sprites[Math.floor(frame / 5) % sprites.length];
  return (
    <Img
      src={asset(src)}
      style={{
        position: "absolute",
        left: 790,
        top: 1790,
        width: 250,
        imageRendering: "pixelated",
        mixBlendMode: "multiply",
        zIndex: 50,
      }}
    />
  );
}

export function YonkoLevelReel() {
  const frame = useCurrentFrame();
  const targetX = valueAt(frame, "x");
  const targetY = valueAt(frame, "y");
  const zoom = valueAt(frame, "z");

  const handJitterX = Math.sin(frame * 0.83) * 2.4 + Math.sin(frame * 0.31) * 1.4;
  const handJitterY = Math.cos(frame * 0.71) * 2.2;
  const exposureFlicker = 0.035 + Math.sin(frame * 0.19) * 0.012;

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
        <div style={{ position: "absolute", inset: 0, background: "#eee8d8", boxShadow: "0 26px 80px rgba(0,0,0,.24)" }} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(90deg, rgba(0,0,0,.08) 1px, transparent 1px), linear-gradient(rgba(0,0,0,.06) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
            opacity: 0.2,
            zIndex: 2,
          }}
        />

        {/* Dense newspaper/design-board spread. Assets intentionally overlap/crop. */}
        <PrintedAsset src="Landing Page Desktop.png" x={-80} y={-90} w={900} rotate={-0.5} />
        <PrintedAsset src="Logo.png" x={570} y={-180} w={830} rotate={0.2} z={8} />
        <PrintedAsset src="Typography.png" x={1240} y={-120} w={820} rotate={-0.28} />
        <PrintedAsset src="Play.date Screen.png" x={1980} y={-40} w={1020} rotate={0.18} z={7} />
        <PrintedAsset src="Blog Post.png" x={2810} y={-40} w={760} rotate={-0.16} />

        <PrintedAsset src="About Page.png" x={-40} y={650} w={830} rotate={0.22} />
        <PrintedAsset src="Blog Page Tablet.png" x={670} y={630} w={690} rotate={-0.18} z={8} />
        <PrintedAsset src="Landing Page Desktop.png" x={1230} y={610} w={900} rotate={0.12} />
        <PrintedAsset src="Typography.png" x={1900} y={650} w={850} rotate={-0.2} opacity={0.9} />
        <PrintedAsset src="Play.date Screen.png" x={2500} y={700} w={1060} rotate={0.2} z={9} />

        <PrintedAsset src="Play.date Screen.png" x={-70} y={1420} w={960} rotate={0.12} z={9} />
        <PrintedAsset src="Blog Post.png" x={620} y={1360} w={760} rotate={-0.18} />
        <PrintedAsset src="Logo.png" x={1180} y={1340} w={760} rotate={0.18} z={10} />
        <PrintedAsset src="About Page.png" x={1780} y={1330} w={820} rotate={-0.15} />
        <PrintedAsset src="Blog Page Tablet.png" x={2440} y={1350} w={680} rotate={0.16} />
        <PrintedAsset src="Landing Page Desktop.png" x={2960} y={1280} w={780} rotate={-0.14} />

        <PrintedAsset src="Typography.png" x={-50} y={1970} w={820} rotate={-0.2} opacity={0.88} />
        <PrintedAsset src="About Page.png" x={660} y={1900} w={850} rotate={0.16} />
        <PrintedAsset src="Play.date Screen.png" x={1390} y={1920} w={950} rotate={-0.14} z={9} />
        <PrintedAsset src="Logo.png" x={2180} y={1910} w={720} rotate={0.2} z={10} />
        <PrintedAsset src="Blog Post.png" x={2780} y={1880} w={790} rotate={-0.12} />

        <RickySprite />

        <Headline x={130} y={120} size={74}>Yonko Level</Headline>
        <Headline x={1450} y={270} size={60}>Brand system</Headline>
        <Headline x={2520} y={1060} size={70}>Interface close-up</Headline>
        <Headline x={980} y={1850} size={70}>Printed detail</Headline>
        <Headline x={2220} y={2060} size={64}>Design reel</Headline>

        <TextBlock x={170} y={360} w={360} />
        <TextBlock x={1520} y={520} w={420} lines={16} />
        <TextBlock x={2250} y={470} w={460} lines={14} />
        <TextBlock x={118} y={1110} w={500} lines={18} />
        <TextBlock x={1450} y={1160} w={430} lines={14} />
        <TextBlock x={2860} y={1120} w={460} lines={16} />
        <TextBlock x={420} y={2150} w={500} lines={14} />
        <TextBlock x={1560} y={2220} w={460} lines={13} />
        <TextBlock x={2860} y={2180} w={500} lines={15} />
      </div>

      {/* Macro print / newspaper texture over the fixed camera frame. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle, rgba(0,0,0,.22) 0 0.65px, transparent 0.75px), radial-gradient(circle, rgba(254,106,90,.14) 0 0.55px, transparent 0.7px), radial-gradient(circle, rgba(49,125,172,.12) 0 0.55px, transparent 0.7px)",
          backgroundPosition: "0 0, 2px 1px, -2px 2px",
          backgroundSize: "5px 5px, 5px 5px, 5px 5px",
          mixBlendMode: "multiply",
          opacity: 0.24,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 50%, transparent 0 58%, rgba(0,0,0,.23) 100%), linear-gradient(90deg, rgba(255,0,0,.035), rgba(0,120,255,.025), rgba(255,205,0,.035))",
          mixBlendMode: "multiply",
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "absolute", inset: 0, background: `rgba(255,255,255,${exposureFlicker})`, pointerEvents: "none" }} />
    </div>
  );
}
