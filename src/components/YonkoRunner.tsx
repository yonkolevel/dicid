"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";

export default function YonkoRunner() {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.45,
  });
  const x = useTransform(smoothProgress, [0, 1], ["8vw", "82vw"]);
  const velocity = useVelocity(scrollYProgress);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isMoving, setIsMoving] = useState(false);
  const stopTimerRef = useRef<number | null>(null);

  useMotionValueEvent(velocity, "change", (latest) => {
    if (Math.abs(latest) < 0.03) return;
    setDirection(latest > 0 ? 1 : -1);
    setIsMoving(true);

    if (stopTimerRef.current) {
      window.clearTimeout(stopTimerRef.current);
    }
    stopTimerRef.current = window.setTimeout(() => setIsMoving(false), 170);
  });

  useEffect(() => {
    return () => {
      if (stopTimerRef.current) window.clearTimeout(stopTimerRef.current);
    };
  }, []);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] left-0 z-40 hidden h-20 w-20 items-end justify-center md:flex"
      style={{ x }}
      animate={{ y: isMoving ? [0, -4, 0, -2, 0] : 0 }}
      transition={{ duration: 0.26, ease: "linear" }}
    >
      <motion.img
        src="/projects/yonko/runner.png"
        alt=""
        className="h-[68px] w-auto drop-shadow-[0_10px_0_rgba(0,0,21,0.16)] [image-rendering:pixelated]"
        animate={{ scaleX: direction, rotate: isMoving ? [0, -3 * direction, 3 * direction, 0] : 0 }}
        transition={{ duration: 0.22, ease: "linear" }}
      />
    </motion.div>
  );
}
