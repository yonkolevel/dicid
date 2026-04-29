"use client";

import { motion } from "framer-motion";
import { projects } from "@/data/projects";
import StageVideo from "./StageVideo";

export default function ProjectsStage() {
  const total = projects.length;

  return (
    <div
      className="relative isolate mx-[30px] mb-[30px] min-h-0 flex-1 overflow-y-auto rounded-sm snap-y snap-mandatory"
      style={{ backgroundColor: "var(--color-pale-blue)" }}
    >
      {projects.map((project, i) => {
        const isLast = i === total - 1;
        return (
          <section
            key={project.id}
            id={`project-${project.number}`}
            className="snap-start relative flex h-full w-full items-center justify-center overflow-hidden px-8 py-8 md:px-12 md:py-10"
            style={{ color: "var(--color-black)" }}
          >
            <StageVideo src={project.videoUrl} />

            <div className="absolute inset-0 bg-white/30 mix-blend-lighten" />

            <div className="absolute top-6 left-6 z-10 flex flex-col gap-1 text-xs font-bold tracking-[0.18em] uppercase md:left-10 md:text-sm">
              <span>{project.tags.join(" / ")}</span>
              <span>For: {project.client}</span>
            </div>

            <div className="absolute top-6 right-6 z-10 text-[10px] font-bold tracking-[0.2em] uppercase opacity-50 md:right-10">
              {project.number} / {String(total).padStart(2, "0")}
            </div>

            <motion.h2
              className="font-heading relative z-10 text-[10vw] leading-[0.9] font-black tracking-[0.04em] uppercase md:text-[7vw]"
              style={{ mixBlendMode: "difference", color: "#ffffff" }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.6, once: false }}
              transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {project.title}
            </motion.h2>

            {!isLast && (
              <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase opacity-80">
                <span>↓ Next project</span>
                <motion.div
                  className="h-5 w-px"
                  style={{ background: "var(--accent)" }}
                  animate={{ scaleY: [0.4, 1, 0.4] }}
                  transition={{
                    duration: 1.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>
            )}
          </section>
        );
      })}

      <section
        id="about"
        className="snap-start relative flex h-full w-full items-center justify-center px-8 py-8 md:px-12 md:py-10"
        style={{ color: "var(--color-black)" }}
      >
        <div className="absolute top-6 left-6 text-xs font-bold tracking-[0.18em] uppercase md:left-10 md:text-sm">
          About
        </div>
        <div className="flex max-w-[60ch] flex-col items-start gap-6 text-left">
          <p className="text-base leading-relaxed md:text-lg">
            DICID is a one-person studio working at the intersection of brand
            strategy and web design. Selected projects above. Drop a line if a
            collaboration is calling.
          </p>
          <a
            href="mailto:hello@dicid.tbd"
            className="dicid-link text-sm font-bold tracking-[0.18em] uppercase"
          >
            hello@dicid.tbd
          </a>
        </div>
      </section>
    </div>
  );
}
