"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { setCustomise, useCustomise } from "@/lib/customise";

type FontOption = {
  id: string;
  cssVar: string;
};

const FONTS: FontOption[] = [
  { id: "sans", cssVar: "var(--font-sans)" },
  { id: "blackletter", cssVar: "var(--font-blackletter)" },
  { id: "serif", cssVar: "var(--font-serif)" },
  { id: "handwritten", cssVar: "var(--font-handwritten)" },
];

type ColorOption = {
  id: string;
  bg: string;
  fg: string;
};

const COLORS: ColorOption[] = [
  { id: "light", bg: "#eef0f3", fg: "#000000" },
  { id: "orange", bg: "#f26a1b", fg: "#000000" },
  { id: "blue", bg: "#2e6fed", fg: "#ffffff" },
  { id: "navy", bg: "#0a1736", fg: "#ffffff" },
];

function FontButton({
  font,
  isActive,
  size,
  onClick,
}: {
  font: FontOption;
  isActive: boolean;
  size: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Use ${font.id} font`}
      className="flex items-center justify-center rounded-full border font-bold leading-none transition-all"
      style={{
        fontFamily: font.cssVar,
        backgroundColor: isActive ? "var(--page-fg)" : "transparent",
        color: isActive ? "var(--page-bg)" : "var(--page-fg)",
        borderColor: "var(--page-fg)",
        height: size,
        width: size,
        fontSize: Math.round(size * 0.46),
      }}
    >
      T
    </button>
  );
}

function ColorButton({
  color,
  isActive,
  size,
  onClick,
}: {
  color: ColorOption;
  isActive: boolean;
  size: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Use ${color.id} colour`}
      className="rounded-full transition-shadow"
      style={{
        backgroundColor: color.bg,
        height: size,
        width: size,
        boxShadow: isActive
          ? "0 0 0 2px var(--page-bg), 0 0 0 3px var(--page-fg)"
          : "0 0 0 1px var(--page-fg)",
      }}
    />
  );
}

function useApplyCustomise() {
  const { font, color } = useCustomise();
  useEffect(() => {
    const f = FONTS.find((x) => x.id === font) ?? FONTS[0];
    const c = COLORS.find((x) => x.id === color) ?? COLORS[0];
    const root = document.documentElement;
    root.style.setProperty("--font-heading-active", f.cssVar);
    root.style.setProperty("--page-bg", c.bg);
    root.style.setProperty("--page-fg", c.fg);
    root.style.setProperty("--accent", "#f26a1b");
  }, [font, color]);
}

export function CustomizePanelDesktop() {
  useApplyCustomise();
  const { font, color } = useCustomise();

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex gap-2">
        {FONTS.map((f) => (
          <FontButton
            key={f.id}
            font={f}
            size={28}
            isActive={f.id === font}
            onClick={() => setCustomise({ font: f.id })}
          />
        ))}
      </div>
      <div className="flex gap-2">
        {COLORS.map((c) => (
          <ColorButton
            key={c.id}
            color={c}
            size={28}
            isActive={c.id === color}
            onClick={() => setCustomise({ color: c.id })}
          />
        ))}
      </div>
    </div>
  );
}

export function CustomizePanelMobile() {
  const { font, color } = useCustomise();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-3 z-50 flex justify-center md:hidden">
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 240, damping: 22, delay: 0.3 }}
        className="pointer-events-auto flex flex-col items-center gap-2 rounded-3xl border border-white/40 bg-white/70 px-5 py-3 shadow-[0_10px_40px_rgba(0,0,0,0.18)] backdrop-blur-xl"
        style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
      >
        <div className="-mt-1 mb-1 h-1 w-10 rounded-full bg-black/25" />

        <div className="flex gap-3">
          {FONTS.map((f) => (
            <FontButton
              key={f.id}
              font={f}
              size={36}
              isActive={f.id === font}
              onClick={() => setCustomise({ font: f.id })}
            />
          ))}
        </div>
        <div className="flex gap-3">
          {COLORS.map((c) => (
            <ColorButton
              key={c.id}
              color={c}
              size={32}
              isActive={c.id === color}
              onClick={() => setCustomise({ color: c.id })}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
