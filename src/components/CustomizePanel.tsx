"use client";

import { useEffect } from "react";
import { Leva, useControls } from "leva";

type ColorPreset = { bg: string; fg: string };

const COLOR_PRESETS: Record<string, ColorPreset> = {
  "Pale Blue": { bg: "#dee8ff", fg: "#000000" },
  Orange: { bg: "#f26a1b", fg: "#000000" },
  "Deep Blue": { bg: "#2f5d8c", fg: "#ffffff" },
  Black: { bg: "#000000", fg: "#ffffff" },
  "Electric Blue": { bg: "#2e6fed", fg: "#ffffff" },
  Green: { bg: "#58e166", fg: "#000000" },
};

const PAGE_BG_OPTIONS: Record<string, string> = Object.fromEntries(
  Object.entries(COLOR_PRESETS).map(([k, v]) => [k, v.bg])
);

const ACCENT_OPTIONS: Record<string, string> = {
  Orange: "#f26a1b",
  "Electric Blue": "#2e6fed",
  Green: "#58e166",
  "Deep Blue": "#2f5d8c",
  Black: "#000000",
};

const FONT_OPTIONS = {
  "Proxima Nova": "var(--font-sans)",
  "Jacques François": "var(--font-serif)",
  "Sister Spray": "var(--font-handwritten)",
  Blackletter: "var(--font-blackletter)",
};

function fgForBg(bg: string): string {
  const match = Object.values(COLOR_PRESETS).find((p) => p.bg === bg);
  return match?.fg ?? "#000000";
}

export default function CustomizePanel() {
  const { pageBg, headingFont, accent } = useControls("Customise", {
    pageBg: {
      label: "Page bg",
      value: COLOR_PRESETS.Black.bg,
      options: PAGE_BG_OPTIONS,
    },
    headingFont: {
      label: "Typography",
      value: FONT_OPTIONS.Blackletter,
      options: FONT_OPTIONS,
    },
    accent: {
      label: "Accent",
      value: ACCENT_OPTIONS.Orange,
      options: ACCENT_OPTIONS,
    },
  });

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--page-bg", pageBg);
    root.style.setProperty("--page-fg", fgForBg(pageBg));
    root.style.setProperty("--font-heading-active", headingFont);
    root.style.setProperty("--accent", accent);
  }, [pageBg, headingFont, accent]);

  return (
    <>
      <Leva
        titleBar={{ title: "CUSTOMISE", drag: true, filter: false }}
        collapsed={false}
        theme={{
          sizes: {
            rootWidth: "240px",
            controlWidth: "120px",
          },
          colors: {
            elevation1: "#ffffff",
            elevation2: "#f5f5f5",
            elevation3: "#eaeaea",
            accent1: "#9b5cf6",
            accent2: "#9b5cf6",
            accent3: "#9b5cf6",
            highlight1: "#000000",
            highlight2: "#000000",
            highlight3: "#000000",
          },
          fontSizes: {
            root: "11px",
          },
        }}
      />
      <div className="pointer-events-none fixed top-3 left-[260px] z-[1001] flex items-center gap-1 select-none">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#9b5cf6] text-[10px] font-bold text-white">
          D
        </span>
        <span className="-ml-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#5a667a] text-[10px] font-bold text-white">
          R
        </span>
      </div>
    </>
  );
}
