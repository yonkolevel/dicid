"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Pane } from "tweakpane";

type InspectableElement = HTMLElement | SVGElement;
type TweakpaneBinding = {
  on(eventName: "change", handler: (event: { value: unknown }) => void): TweakpaneBinding;
};

type TweakpaneButton = {
  on(eventName: "click", handler: () => void): TweakpaneButton;
};

type TweakpaneFolder = {
  addBinding(
    object: Record<string, unknown>,
    key: string,
    params?: Record<string, unknown>
  ): TweakpaneBinding;
};

type TweakpanePane = TweakpaneFolder & {
  addButton(params: { title: string }): TweakpaneButton;
  addFolder(params: { title: string; expanded?: boolean }): TweakpaneFolder;
  dispose(): void;
};

type Box = {
  top: number;
  left: number;
  width: number;
  height: number;
};

type DesignParams = {
  selector: string;
  text: string;
  color: string;
  backgroundColor: string;
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  letterSpacing: string;
  width: string;
  height: string;
  padding: string;
  margin: string;
  gap: string;
  borderRadius: string;
  border: string;
  opacity: number;
  boxShadow: string;
  transform: string;
};

const STYLE_KEYS: Array<keyof Omit<DesignParams, "selector" | "text">> = [
  "color",
  "backgroundColor",
  "fontFamily",
  "fontSize",
  "fontWeight",
  "lineHeight",
  "letterSpacing",
  "width",
  "height",
  "padding",
  "margin",
  "gap",
  "borderRadius",
  "border",
  "opacity",
  "boxShadow",
  "transform",
];

function isInspectableElement(value: EventTarget | null): value is InspectableElement {
  return value instanceof HTMLElement || value instanceof SVGElement;
}

function isInsideInspector(element: Element | null): boolean {
  return Boolean(element?.closest("[data-dev-design-inspector]"));
}

function cssPropertyName(property: string): string {
  return property.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
}

function computed(element: InspectableElement, property: string): string {
  return getComputedStyle(element).getPropertyValue(cssPropertyName(property)).trim();
}

function inline(element: InspectableElement, property: string): string {
  return element.style.getPropertyValue(cssPropertyName(property));
}

function normalizeColor(value: string): string {
  if (!value || value === "transparent" || value === "rgba(0, 0, 0, 0)") return "#000000";
  if (value.startsWith("#")) return value;

  const match = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (!match) return value;

  return [match[1], match[2], match[3]]
    .map((part) => Number(part).toString(16).padStart(2, "0"))
    .join("")
    .replace(/^/, "#");
}

function getElementText(element: InspectableElement): string {
  return element.textContent?.trim().replace(/\s+/g, " ").slice(0, 260) ?? "";
}

function getElementLabel(element: InspectableElement | null): string {
  if (!element) return "No element selected";
  const tag = element.tagName.toLowerCase();
  const id = element.id ? `#${element.id}` : "";
  const classes = element.getAttribute("class")
    ? `.${String(element.getAttribute("class")).trim().split(/\s+/).slice(0, 3).join(".")}`
    : "";

  return `${tag}${id}${classes}`;
}

function getBestSelector(element: InspectableElement): string {
  if (element.id) return `#${CSS.escape(element.id)}`;

  const parts: string[] = [];
  let current: Element | null = element;

  while (current && current !== document.body && parts.length < 5) {
    const tag = current.tagName.toLowerCase();
    const id = current.id ? `#${CSS.escape(current.id)}` : "";

    if (id) {
      parts.unshift(`${tag}${id}`);
      break;
    }

    const classList = Array.from(current.classList)
      .filter((className) => !className.includes(":"))
      .slice(0, 3)
      .map((className) => `.${CSS.escape(className)}`)
      .join("");

    const parent: HTMLElement | null = current.parentElement;
    const currentTagName = current.tagName;
    const sameTagSiblings = parent
      ? Array.from(parent.children).filter((child) => child.tagName === currentTagName)
      : [];
    const nth =
      sameTagSiblings.length > 1
        ? `:nth-of-type(${sameTagSiblings.indexOf(current) + 1})`
        : "";

    parts.unshift(`${tag}${classList}${nth}`);
    current = parent;
  }

  return parts.join(" > ");
}

function getBox(element: InspectableElement | null): Box | null {
  if (!element) return null;
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
  };
}

function paramsFromElement(element: InspectableElement): DesignParams {
  return {
    selector: getBestSelector(element),
    text: getElementText(element),
    color: normalizeColor(inline(element, "color") || computed(element, "color")),
    backgroundColor: normalizeColor(
      inline(element, "backgroundColor") || computed(element, "backgroundColor")
    ),
    fontFamily: inline(element, "fontFamily") || computed(element, "fontFamily"),
    fontSize: inline(element, "fontSize") || computed(element, "fontSize"),
    fontWeight: inline(element, "fontWeight") || computed(element, "fontWeight"),
    lineHeight: inline(element, "lineHeight") || computed(element, "lineHeight"),
    letterSpacing: inline(element, "letterSpacing") || computed(element, "letterSpacing"),
    width: inline(element, "width") || computed(element, "width"),
    height: inline(element, "height") || computed(element, "height"),
    padding: inline(element, "padding") || computed(element, "padding"),
    margin: inline(element, "margin") || computed(element, "margin"),
    gap: inline(element, "gap") || computed(element, "gap"),
    borderRadius: inline(element, "borderRadius") || computed(element, "borderRadius"),
    border: inline(element, "border") || computed(element, "border"),
    opacity: Number(inline(element, "opacity") || computed(element, "opacity") || 1),
    boxShadow: inline(element, "boxShadow") || computed(element, "boxShadow"),
    transform: inline(element, "transform") || computed(element, "transform"),
  };
}

function applyParam(element: InspectableElement, key: keyof DesignParams, value: unknown): void {
  if (key === "selector") return;
  if (key === "text") {
    element.textContent = String(value);
    return;
  }

  element.style.setProperty(cssPropertyName(key), String(value));
}

function buildCopyPayload(element: InspectableElement, params: DesignParams) {
  const inlineStyleOverrides = Object.fromEntries(
    STYLE_KEYS.map((key) => [key, inline(element, key)]).filter(([, value]) => Boolean(value))
  );
  const computedSnapshot = Object.fromEntries(STYLE_KEYS.map((key) => [key, computed(element, key)]));

  return {
    request:
      "Please update this website's source code to match these designer-approved WYSIWYG tweaks. Convert the temporary live values into durable Tailwind classes, CSS variables, or component code. Do not blindly paste inline styles unless that is already the local pattern.",
    page: window.location.pathname,
    selectedElement: {
      selector: getBestSelector(element),
      tagName: element.tagName.toLowerCase(),
      className: element.getAttribute("class") ?? "",
      originalText: getElementText(element),
    },
    designerValues: params,
    liveInlineStyleOverrides: inlineStyleOverrides,
    computedSnapshot,
  };
}

function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

// ─── Tweakpane binding helpers ────────────────────────────────────────────────

type SliderOpts = { min: number; max: number; step: number; fallbackUnit?: string };

function parseCSS(raw: string): { num: number; unit: string } | null {
  const m = raw.trim().match(/^(-?[\d.]+)(px|rem|em|%|vh|vw)?$/);
  if (!m) return null;
  return { num: parseFloat(m[1]), unit: m[2] ?? "" };
}

function bindText(
  folder: TweakpaneFolder,
  el: InspectableElement,
  label: string,
  raw: string,
  cssProp: string
): void {
  const obj: Record<string, unknown> = { v: raw };
  folder.addBinding(obj, "v", { label }).on("change", ({ value }: { value: unknown }) => {
    el.style.setProperty(cssProp, String(value));
  });
}

function bindSlider(
  folder: TweakpaneFolder,
  el: InspectableElement,
  label: string,
  raw: string,
  cssProp: string,
  opts: SliderOpts
): boolean {
  const p = parseCSS(raw);
  if (!p) return false;
  const unit = p.unit || opts.fallbackUnit || "";
  const obj: Record<string, unknown> = { v: p.num };
  folder
    .addBinding(obj, "v", { label, min: opts.min, max: opts.max, step: opts.step })
    .on("change", ({ value }: { value: unknown }) => {
      el.style.setProperty(cssProp, `${value}${unit}`);
    });
  return true;
}

function bindList(
  folder: TweakpaneFolder,
  el: InspectableElement,
  label: string,
  raw: string,
  cssProp: string,
  options: Record<string, string>
): void {
  const obj: Record<string, unknown> = { v: raw };
  folder
    .addBinding(obj, "v", { label, options })
    .on("change", ({ value }: { value: unknown }) => {
      el.style.setProperty(cssProp, String(value));
    });
}

// ──────────────────────────────────────────────────────────────────────────────

function disposePane(pane: TweakpanePane | null): void {
  if (!pane) return;

  try {
    pane.dispose();
  } catch (error) {
    if (!(error instanceof Error) || !error.message.includes("already disposed")) {
      throw error;
    }
  }
}

function IconCopy() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M11 5V3.5A1.5 1.5 0 0 0 9.5 2H3.5A1.5 1.5 0 0 0 2 3.5V9.5A1.5 1.5 0 0 0 3.5 11H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconReset() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2.5 8a5.5 5.5 0 1 0 1.1-3.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.5 3.5V8H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconCursor() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2 2l7 3.5-3.5 1L4 10z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

export default function DevDesignInspector() {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedElement, setSelectedElement] = useState<InspectableElement | null>(null);
  const [hoveredElement, setHoveredElement] = useState<InspectableElement | null>(null);
  const [selectedBox, setSelectedBox] = useState<Box | null>(null);
  const [hoveredBox, setHoveredBox] = useState<Box | null>(null);
  const [status, setStatus] = useState<{ text: string; type: "idle" | "ok" | "err" }>({
    text: "Click any element on the page to inspect it.",
    type: "idle",
  });
  const [copied, setCopied] = useState(false);
  const [panelPosition, setPanelPosition] = useState({ x: 16, y: 16 });
  const dragRef = useRef({
    isDragging: false,
    pointerId: 0,
    startX: 0,
    startY: 0,
    originX: 16,
    originY: 16,
  });
  const paneHostRef = useRef<HTMLDivElement | null>(null);
  const paneRef = useRef<TweakpanePane | null>(null);
  const selectedElementRef = useRef<InspectableElement | null>(null);
  const paramsRef = useRef<DesignParams | null>(null);

  // Always-on selection — no mode toggle needed
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerMove = (event: PointerEvent) => {
      if (!isInspectableElement(event.target) || isInsideInspector(event.target)) {
        setHoveredElement(null);
        return;
      }
      if (event.target === selectedElementRef.current) {
        setHoveredElement(null);
        return;
      }
      setHoveredElement(event.target);
    };

    const handleClick = (event: MouseEvent) => {
      if (!isInspectableElement(event.target) || isInsideInspector(event.target)) return;
      event.preventDefault();
      event.stopPropagation();

      const target = event.target;
      selectedElementRef.current = target;
      setSelectedElement(target);
      setHoveredElement(null);
      setStatus({ text: "Tweak values in the pane, then copy the AI brief.", type: "idle" });
    };

    document.addEventListener("pointermove", handlePointerMove, true);
    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("pointermove", handlePointerMove, true);
      document.removeEventListener("click", handleClick, true);
    };
  }, [isOpen]);

  useEffect(() => {
    const refreshBoxes = () => {
      setSelectedBox(getBox(selectedElement));
      setHoveredBox(getBox(hoveredElement));
    };

    refreshBoxes();
    window.addEventListener("resize", refreshBoxes);
    window.addEventListener("scroll", refreshBoxes, true);
    const interval = window.setInterval(refreshBoxes, 250);

    return () => {
      window.removeEventListener("resize", refreshBoxes);
      window.removeEventListener("scroll", refreshBoxes, true);
      window.clearInterval(interval);
    };
  }, [hoveredElement, selectedElement]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key.toLowerCase() === "d") {
        event.preventDefault();
        setIsOpen((current) => !current);
      }
      if (event.key === "Escape") {
        setSelectedElement(null);
        selectedElementRef.current = null;
        setHoveredElement(null);
        setStatus({ text: "Click any element on the page to inspect it.", type: "idle" });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!paneHostRef.current || !isOpen) return;

    disposePane(paneRef.current);
    paneRef.current = null;
    paneHostRef.current.innerHTML = "";

    const pane = new Pane({
      container: paneHostRef.current,
      title: "DICID WYSIWYG",
    }) as unknown as TweakpanePane;
    paneRef.current = pane;

    if (!selectedElement) {
      const empty = {
        mode: "Click any element on the page to begin.",
      };
      pane.addBinding(empty, "mode", { label: "Hint", readonly: true });
      return () => {
        disposePane(pane);
        if (paneRef.current === pane) paneRef.current = null;
      };
    }

    const params = paramsFromElement(selectedElement);
    paramsRef.current = params;

    pane.addBinding(params, "selector", { label: "Element", readonly: true });

    // Content
    const content = pane.addFolder({ title: "Content", expanded: true });
    content.addBinding(params, "text", { label: "Text" }).on("change", (event: { value: unknown }) => {
      applyParam(selectedElement, "text", event.value);
    });

    // Typography
    const type = pane.addFolder({ title: "Typography", expanded: true });

    // Color & bg: keep params-based binding so Tweakpane auto-detects hex → color picker
    type.addBinding(params, "color", { label: "Color" }).on("change", ({ value }: { value: unknown }) => {
      applyParam(selectedElement, "color", value);
    });

    // Font family: text input (values are full font stacks, not discrete)
    bindText(type, selectedElement, "Family", params.fontFamily, "font-family");

    // Font size: slider with range matched to unit
    {
      const p = parseCSS(params.fontSize);
      const sliderOpts: SliderOpts | null = p
        ? p.unit === "rem"
          ? { min: 0.25, max: 8, step: 0.125 }
          : { min: 6, max: 144, step: 0.5, fallbackUnit: "px" }
        : null;
      if (!sliderOpts || !bindSlider(type, selectedElement, "Size", params.fontSize, "font-size", sliderOpts)) {
        bindText(type, selectedElement, "Size", params.fontSize, "font-size");
      }
    }

    // Font weight: discrete dropdown
    bindList(type, selectedElement, "Weight", params.fontWeight, "font-weight", {
      "100 — Thin": "100",
      "200 — ExtraLight": "200",
      "300 — Light": "300",
      "400 — Regular": "400",
      "500 — Medium": "500",
      "600 — SemiBold": "600",
      "700 — Bold": "700",
      "800 — ExtraBold": "800",
      "900 — Black": "900",
    });

    // Line height: slider — unitless (1.0–3.5) or px (8–120)
    {
      const p = parseCSS(params.lineHeight);
      if (!p || !bindSlider(type, selectedElement, "Line", params.lineHeight, "line-height",
        !p.unit ? { min: 0.8, max: 3.5, step: 0.05 } : { min: 8, max: 120, step: 0.5, fallbackUnit: "px" }
      )) {
        bindText(type, selectedElement, "Line", params.lineHeight, "line-height");
      }
    }

    // Letter spacing: slider — em (-0.1 to 0.5) or px (-5 to 20)
    {
      const p = parseCSS(params.letterSpacing);
      if (!p || !bindSlider(type, selectedElement, "Tracking", params.letterSpacing, "letter-spacing",
        p.unit === "em" ? { min: -0.1, max: 0.5, step: 0.001 } : { min: -5, max: 20, step: 0.1, fallbackUnit: "px" }
      )) {
        bindText(type, selectedElement, "Tracking", params.letterSpacing, "letter-spacing");
      }
    }

    // Layout
    const layout = pane.addFolder({ title: "Layout", expanded: true });
    bindText(layout, selectedElement, "Width", params.width, "width");
    bindText(layout, selectedElement, "Height", params.height, "height");
    bindText(layout, selectedElement, "Padding", params.padding, "padding");
    bindText(layout, selectedElement, "Margin", params.margin, "margin");
    // Gap: slider if single parseable value
    if (!bindSlider(layout, selectedElement, "Gap", params.gap, "gap", { min: 0, max: 80, step: 1, fallbackUnit: "px" })) {
      bindText(layout, selectedElement, "Gap", params.gap, "gap");
    }

    // Appearance
    const appearance = pane.addFolder({ title: "Appearance", expanded: true });

    appearance.addBinding(params, "backgroundColor", { label: "Bg" }).on("change", ({ value }: { value: unknown }) => {
      applyParam(selectedElement, "backgroundColor", value);
    });

    // Border radius: slider with adaptive max based on current value
    {
      const p = parseCSS(params.borderRadius);
      if (p && (p.unit === "px" || !p.unit)) {
        const maxVal = Math.max(200, Math.ceil(p.num / 50) * 50 + 50);
        bindSlider(appearance, selectedElement, "Radius", params.borderRadius, "border-radius", {
          min: 0, max: maxVal, step: p.num > 50 ? 1 : 0.5, fallbackUnit: "px",
        });
      } else {
        bindText(appearance, selectedElement, "Radius", params.borderRadius, "border-radius");
      }
    }

    bindText(appearance, selectedElement, "Border", params.border, "border");

    appearance
      .addBinding(params, "opacity", { label: "Opacity", min: 0, max: 1, step: 0.01 })
      .on("change", ({ value }: { value: unknown }) => {
        applyParam(selectedElement, "opacity", value);
      });

    bindText(appearance, selectedElement, "Shadow", params.boxShadow, "box-shadow");
    bindText(appearance, selectedElement, "Transform", params.transform, "transform");

    return () => {
      disposePane(pane);
      if (paneRef.current === pane) paneRef.current = null;
    };
  }, [isOpen, selectedElement]);

  const selectedLabel = useMemo(() => getElementLabel(selectedElement), [selectedElement]);

  const copyAiBrief = async () => {
    const element = selectedElementRef.current;
    const currentParams = paramsRef.current;
    if (!element || !currentParams) {
      setStatus({ text: "Select an element first.", type: "err" });
      return;
    }

    try {
      await copyToClipboard(JSON.stringify(buildCopyPayload(element, currentParams), null, 2));
      setCopied(true);
      setStatus({ text: "Copied — paste into an AI agent to apply changes.", type: "ok" });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setStatus({ text: "Clipboard write failed. Try from a localhost/dev page.", type: "err" });
    }
  };

  const resetTemporaryTweaks = () => {
    const element = selectedElementRef.current;
    if (!element) {
      setStatus({ text: "Nothing selected to reset.", type: "err" });
      return;
    }

    STYLE_KEYS.forEach((key) => element.style.removeProperty(cssPropertyName(key)));
    setSelectedElement(null);
    selectedElementRef.current = null;
    paramsRef.current = null;
    setStatus({ text: "Tweaks cleared. Click any element to inspect it.", type: "idle" });
  };

  const startPanelDrag = (event: React.PointerEvent<HTMLElement>) => {
    if (event.button !== 0) return;

    const target = event.target as HTMLElement;
    if (target.closest("button")) return;

    dragRef.current = {
      isDragging: true,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: panelPosition.x,
      originY: panelPosition.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const movePanelDrag = (event: React.PointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    if (!drag.isDragging || drag.pointerId !== event.pointerId) return;

    const panelWidth = isOpen ? 380 : 150;
    const panelHeight = isOpen ? Math.min(window.innerHeight - 32, 720) : 44;
    const maxX = Math.max(8, window.innerWidth - panelWidth - 8);
    const maxY = Math.max(8, window.innerHeight - panelHeight - 8);

    setPanelPosition({
      x: Math.min(maxX, Math.max(8, drag.originX + event.clientX - drag.startX)),
      y: Math.min(maxY, Math.max(8, drag.originY + event.clientY - drag.startY)),
    });
  };

  const stopPanelDrag = (event: React.PointerEvent<HTMLElement>) => {
    if (dragRef.current.pointerId === event.pointerId) {
      dragRef.current.isDragging = false;
    }
  };

  return (
    <>
      {(hoveredBox || selectedBox) && (
        <div className="pointer-events-none fixed inset-0 z-[9998]">
          {hoveredBox && (
            <div className="absolute border border-dashed border-orange bg-orange/10" style={hoveredBox} />
          )}
          {selectedBox && (
            <div
              className="absolute border-2 border-orange shadow-[0_0_0_9999px_rgba(0,0,0,0.04)]"
              style={selectedBox}
            />
          )}
        </div>
      )}

      <div
        data-dev-design-inspector
        className="fixed z-[9999] font-sans text-white"
        style={{ left: panelPosition.x, top: panelPosition.y }}
      >
        <style>{`
          [data-dev-design-inspector] .dicid-tweakpane {
            --tp-base-background-color: transparent;
            --tp-base-shadow-color: transparent;
            --tp-button-background-color: rgba(255,255,255,0.10);
            --tp-button-background-color-active: rgba(242,106,27,0.95);
            --tp-button-background-color-focus: rgba(255,255,255,0.16);
            --tp-button-background-color-hover: rgba(255,255,255,0.16);
            --tp-button-foreground-color: rgba(255,255,255,0.92);
            --tp-container-background-color: rgba(255,255,255,0.06);
            --tp-container-background-color-active: rgba(255,255,255,0.10);
            --tp-container-background-color-focus: rgba(255,255,255,0.10);
            --tp-container-background-color-hover: rgba(255,255,255,0.08);
            --tp-container-foreground-color: rgba(255,255,255,0.74);
            --tp-groove-foreground-color: rgba(255,255,255,0.16);
            --tp-input-background-color: rgba(255,255,255,0.09);
            --tp-input-background-color-active: rgba(255,255,255,0.14);
            --tp-input-background-color-focus: rgba(255,255,255,0.14);
            --tp-input-background-color-hover: rgba(255,255,255,0.12);
            --tp-input-foreground-color: rgba(255,255,255,0.94);
            --tp-label-foreground-color: rgba(255,255,255,0.54);
            --tp-monitor-background-color: rgba(0,0,0,0.20);
            --tp-monitor-foreground-color: rgba(255,255,255,0.64);
            --tp-blade-spacing: 8px;
            --tp-blade-unit-size: 30px;
            width: 100%;
          }
          [data-dev-design-inspector] .dicid-tweakpane > div {
            border-radius: 0 !important;
            box-shadow: none !important;
          }
        `}</style>
        {!isOpen ? (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            onPointerDown={startPanelDrag}
            onPointerMove={movePanelDrag}
            onPointerUp={stopPanelDrag}
            onPointerCancel={stopPanelDrag}
            className="group flex cursor-grab touch-none items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-black shadow-[0_14px_50px_rgba(0,0,0,0.20)] transition hover:-translate-y-0.5 hover:bg-orange active:cursor-grabbing"
          >
            <span className="h-2 w-2 rounded-full bg-orange transition group-hover:bg-black" />
            WYSIWYG
          </button>
        ) : (
          <aside className="flex max-h-[calc(100dvh-2rem)] w-[380px] flex-col overflow-hidden rounded-[1.35rem] border border-white/15 bg-[#0b0b0b]/94 shadow-[0_24px_90px_rgba(0,0,0,0.46)] backdrop-blur-2xl">
            {/* Header */}
            <div
              className="cursor-grab touch-none border-b border-white/10 p-4 pb-3 active:cursor-grabbing"
              onPointerDown={startPanelDrag}
              onPointerMove={movePanelDrag}
              onPointerUp={stopPanelDrag}
              onPointerCancel={stopPanelDrag}
              title="Drag to move panel"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-orange">Designer handoff</p>
                  <h2 className="mt-1 text-lg font-black uppercase tracking-[0.06em]">WYSIWYG panel</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-sm font-bold transition hover:bg-white/20"
                  aria-label="Close WYSIWYG panel"
                >
                  ×
                </button>
              </div>

              <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.045] p-3">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/40">Selected element</p>
                <p className="mt-1 break-all text-xs font-bold leading-relaxed text-white/80">{selectedLabel}</p>
              </div>
            </div>

            {/* Status bar */}
            <div
              className={`flex items-center gap-2 border-b border-white/10 px-4 py-2.5 text-xs leading-relaxed transition-colors ${
                status.type === "ok"
                  ? "bg-green-500/10 text-green-300"
                  : status.type === "err"
                  ? "bg-red-500/10 text-red-300"
                  : "bg-orange/10 text-white/60"
              }`}
            >
              <IconCursor />
              {status.text}
            </div>

            {/* Pane */}
            <div className="min-h-0 flex-1 overflow-y-auto p-3">
              <div ref={paneHostRef} className="dicid-tweakpane" />
            </div>

            {/* Action bar */}
            <div className="flex items-center gap-2 border-t border-white/10 bg-black/35 p-3">
              <button
                type="button"
                onClick={resetTemporaryTweaks}
                disabled={!selectedElement}
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-white/12 text-white/50 transition hover:border-white/24 hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
                aria-label="Reset tweaks"
                title="Reset tweaks"
              >
                <IconReset />
              </button>

              <button
                type="button"
                onClick={copyAiBrief}
                disabled={!selectedElement}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-[0.16em] transition ${
                  copied
                    ? "bg-green-500 text-white"
                    : "bg-orange text-black hover:bg-white"
                } disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/35`}
              >
                <IconCopy />
                {copied ? "Copied!" : "Copy AI Brief"}
              </button>
            </div>
          </aside>
        )}
      </div>
    </>
  );
}
