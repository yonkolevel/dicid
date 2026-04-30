"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { projects } from "@/data/projects";
import StageVideo from "./StageVideo";

const ANIM_LOCK_MS = 500;
const WHEEL_PAUSE_MS = 120;
const WHEEL_SPIKE_RATIO = 1.5;
const WHEEL_SPIKE_FLOOR = 30;
const TOUCH_THRESHOLD = 30;

export default function ProjectsStage() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const animLockRef = useRef(false);
  const lastWheelTimeRef = useRef(0);
  const lastWheelDeltaRef = useRef(0);
  const lastWheelDirectionRef = useRef(0);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const sections = () =>
      Array.from(el.querySelectorAll<HTMLElement>("[data-snap]"));

    const stepTo = (direction: 1 | -1) => {
      if (animLockRef.current) return;
      const items = sections();
      if (items.length === 0) return;
      const height = el.clientHeight;
      const currentIdx = Math.round(el.scrollTop / height);
      const nextIdx = Math.max(
        0,
        Math.min(items.length - 1, currentIdx + direction)
      );
      if (nextIdx === currentIdx) return;
      animLockRef.current = true;
      items[nextIdx].scrollIntoView({ behavior: "smooth", block: "start" });
      window.setTimeout(() => {
        animLockRef.current = false;
      }, ANIM_LOCK_MS);
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const now = e.timeStamp;
      const delta = e.deltaY;
      const absDelta = Math.abs(delta);
      const direction = delta > 0 ? 1 : -1;

      const dt = now - lastWheelTimeRef.current;
      const directionChanged = direction !== lastWheelDirectionRef.current;
      const isPause = dt > WHEEL_PAUSE_MS;
      const isSpike =
        absDelta >= WHEEL_SPIKE_FLOOR &&
        absDelta > Math.abs(lastWheelDeltaRef.current) * WHEEL_SPIKE_RATIO;

      lastWheelTimeRef.current = now;
      lastWheelDeltaRef.current = delta;
      lastWheelDirectionRef.current = direction;

      if (!(isPause || isSpike || directionChanged)) return;

      stepTo(direction as 1 | -1);
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (touchStartY.current == null) return;
      const dy = touchStartY.current - e.changedTouches[0].clientY;
      touchStartY.current = null;
      if (Math.abs(dy) < TOUCH_THRESHOLD) return;
      stepTo(dy > 0 ? 1 : -1);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        stepTo(1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        stepTo(-1);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const advanceTo = (id: string) => {
    if (animLockRef.current) return;
    const target = document.getElementById(id);
    if (!target) return;
    animLockRef.current = true;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => {
      animLockRef.current = false;
    }, ANIM_LOCK_MS);
  };

  return (
    <div
      ref={scrollerRef}
      className="relative isolate mx-[20px] mb-[120px] min-h-0 flex-1 overflow-hidden scroll-smooth rounded-sm md:mx-[30px] md:mb-[30px]"
    >
      {projects.map((project, i) => {
        const next = projects[i + 1];
        const nextId = next ? `project-${next.id}` : null;
        return (
          <section
            key={project.id}
            id={`project-${project.id}`}
            data-snap
            className="relative flex h-full w-full items-end justify-center overflow-hidden"
          >
            <StageVideo src={project.videoUrl} />

            <div className="absolute top-6 left-6 z-10 flex flex-col gap-1 text-white md:top-8 md:left-8">
              <span className="text-sm font-black tracking-[0.12em] uppercase md:text-base">
                {project.name}
              </span>
              <span className="text-[10px] font-bold tracking-[0.18em] uppercase opacity-80 md:text-xs">
                {project.tags.join(" / ")}
              </span>
            </div>

            {nextId && (
              <motion.a
                href={`#${nextId}`}
                onClick={(e) => {
                  e.preventDefault();
                  advanceTo(nextId);
                }}
                className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 text-white transition-opacity hover:opacity-70"
                aria-label={`Go to next project ${next?.name}`}
                animate={{ y: [0, 4, 0] }}
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <svg
                  width="22"
                  height="12"
                  viewBox="0 0 22 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 1L11 10L21 1"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.a>
            )}
          </section>
        );
      })}
    </div>
  );
}
