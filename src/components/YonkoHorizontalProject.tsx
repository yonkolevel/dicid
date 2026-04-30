"use client";

import Image from "next/image";
import Link from "next/link";
import { RefObject, useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

function HorizontalRunner({
  containerRef,
}: {
  containerRef: RefObject<HTMLDivElement | null>;
}) {
  const { scrollX, scrollXProgress } = useScroll({
    container: containerRef,
    axis: "x",
  });
  const smoothProgress = useSpring(scrollXProgress, {
    stiffness: 95,
    damping: 24,
    mass: 0.45,
  });
  const x = useTransform(smoothProgress, [0, 1], ["6vw", "86vw"]);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isMoving, setIsMoving] = useState(false);
  const stopTimerRef = useRef<number | null>(null);

  useMotionValueEvent(scrollX, "change", (latest) => {
    const previous = scrollX.getPrevious();
    if (previous === undefined || latest === previous) return;
    setDirection(latest > previous ? 1 : -1);
    setIsMoving(true);

    if (stopTimerRef.current) window.clearTimeout(stopTimerRef.current);
    stopTimerRef.current = window.setTimeout(() => setIsMoving(false), 160);
  });

  useEffect(() => {
    return () => {
      if (stopTimerRef.current) window.clearTimeout(stopTimerRef.current);
    };
  }, []);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute bottom-[30px] left-0 z-30 hidden h-16 w-16 items-end justify-center md:flex"
      style={{ x }}
      animate={{ y: isMoving ? [0, -5, 0, -3, 0] : 0 }}
      transition={{ duration: 0.24, ease: "linear" }}
    >
      <motion.img
        src="/projects/yonko/runner.png"
        alt=""
        className="h-10 w-auto [image-rendering:pixelated]"
        animate={{
          scaleX: direction,
          rotate: isMoving ? [0, -3 * direction, 3 * direction, 0] : 0,
        }}
        transition={{ duration: 0.2, ease: "linear" }}
      />
    </motion.div>
  );
}

function TitleInfo({
  title,
  children,
  width = "w-[620px]",
}: {
  title: string;
  children: React.ReactNode;
  width?: string;
}) {
  return (
    <section
      className={`${width} grid h-full shrink-0 snap-start place-items-center bg-[#eef1f4] px-20`}
    >
      <div className="grid grid-cols-[95px_280px] items-center gap-12 text-[#34426c]">
        <h3 className="text-[42px] leading-none font-normal tracking-[0.01em]">
          {title}
        </h3>
        <div className="text-sm leading-[1.2] font-light tracking-[0.01em]">
          {children}
        </div>
      </div>
    </section>
  );
}

function ImageInfoSection({
  title,
  body,
  image,
  imageAlt,
  imageClassName = "h-[70vh] w-auto",
  reverse = false,
}: {
  title: string;
  body: string;
  image: string;
  imageAlt: string;
  imageClassName?: string;
  reverse?: boolean;
}) {
  return (
    <section className="grid h-full w-[980px] shrink-0 snap-start grid-cols-[1fr_260px] gap-10 bg-[#eef1f4] p-10 text-[#34426c]">
      <div
        className={`grid place-items-center overflow-hidden ${reverse ? "order-2" : ""}`}
      >
        <Image
          src={image}
          alt={imageAlt}
          width={1200}
          height={900}
          className={imageClassName}
        />
      </div>
      <div className={`self-center ${reverse ? "order-1" : ""}`}>
        <h3 className="text-[28px] leading-none font-light tracking-[0.01em]">
          {title}
        </h3>
        <p className="mt-7 text-xs leading-[1.2] font-light tracking-[0.01em]">
          {body}
        </p>
      </div>
    </section>
  );
}

export default function YonkoHorizontalProject() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      event.preventDefault();
      el.scrollBy({ left: event.deltaY, behavior: "auto" });
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const amount = el.clientWidth * 0.85;
      if (["ArrowDown", "ArrowRight", "PageDown"].includes(event.key)) {
        event.preventDefault();
        el.scrollBy({ left: amount, behavior: "smooth" });
      }
      if (["ArrowUp", "ArrowLeft", "PageUp"].includes(event.key)) {
        event.preventDefault();
        el.scrollBy({ left: -amount, behavior: "smooth" });
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    return () => {
      el.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <section className="relative min-h-0 flex-1 px-[20px] pb-[120px] md:px-[30px] md:pb-[30px]">
      <div
        ref={scrollerRef}
        className="hide-scrollbar relative h-full overflow-x-auto overflow-y-hidden bg-white text-[#000015] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Yonko Level horizontal project case study"
      >
        <div className="flex h-full w-max snap-x snap-mandatory">
          <section className="relative h-full w-[calc(100vw-60px)] min-w-[1120px] shrink-0 snap-start bg-white">
            <Link
              href="/"
              className="absolute top-4 left-4 z-20 text-xs font-black tracking-[0.16em] uppercase opacity-0 transition-opacity hover:opacity-100 focus:opacity-100"
            >
              Close [X]
            </Link>

            <div className="absolute top-[5%] left-[14%] flex items-start gap-5">
              <span className="font-serif text-sm">色</span>
              <h2 className="text-center text-2xl leading-[1.04] font-black tracking-[0.04em]">
                C<br />O<br />L<br />O<br />R<br />S
              </h2>
            </div>

            <div className="absolute bottom-[8%] left-[18.5%] w-[235px] space-y-7 text-xs leading-[1.16] md:text-sm">
              <p>
                With colors, we want to convey confidence and optimism, their
                meaning was taken into account in both the west and the east.
                The blue and orange color is widely used in Japanese posters, in
                some animes we can see them in the costumes of the main heroes,
                reinforcing its meaning.
              </p>
              <p className="font-serif leading-[1.23]">
                色で自信と楽観主義を伝えたい、その意味は 西と東の両方で考慮されました。青とオレンジの色は日本のポスターで広く使われていますが、一部のアニメでは主人公の衣装でそれらを見ることができ、その意味を強化しています。
              </p>
            </div>

            <Image
              src="/projects/yonko/ricky-standing-front.svg"
              alt="Pixel character from the Yonko Level project"
              width={246}
              height={376}
              priority
              className="absolute top-[23%] left-1/2 h-[47vh] w-auto -translate-x-1/2 [image-rendering:pixelated]"
            />

            {/* Left-side callouts: swatches stack vertically, then their leader lines run into the face area. */}
            <div className="absolute top-[14%] left-[33%] h-[22%] w-[20%]">
              <div className="absolute top-0 left-0 flex items-start gap-4">
                <span className="h-12 w-12 bg-[#000015]" />
                <Image
                  src="/projects/yonko/color-spec-black.svg"
                  alt="Black color spec"
                  width={214}
                  height={92}
                  className="mt-1 h-auto w-[178px]"
                />
              </div>
              <span className="absolute top-[68px] left-6 h-[27vh] w-px bg-[#317dac]" />
              <span className="absolute top-[calc(68px+27vh)] left-6 h-px w-[25vw] bg-[#317dac]" />
              <span className="absolute top-[calc(68px+27vh-2px)] left-[calc(6px+25vw)] h-1 w-1 rounded-full bg-[#317dac]" />
            </div>

            <div className="absolute top-[44%] left-[33.5%] h-[20%] w-[20%]">
              <div className="absolute bottom-0 left-0 flex items-start gap-4">
                <span className="h-12 w-12 border border-[#000015] bg-[#f8fafd]" />
                <Image
                  src="/projects/yonko/color-spec-white.svg"
                  alt="White cloud color spec"
                  width={214}
                  height={92}
                  className="mt-1 h-auto w-[188px]"
                />
              </div>
              <span className="absolute top-0 left-8 h-[10vh] w-px bg-[#000015]" />
              <span className="absolute top-0 left-8 h-px w-[24vw] bg-[#000015]" />
              <span className="absolute top-[-2px] left-[calc(8px+24vw)] h-1 w-1 rounded-full bg-[#000015]" />
            </div>

            {/* Right-side callouts mirror the Framer layout: orange high, blue low. */}
            <div className="absolute top-[23%] right-[9%] h-[34%] w-[25%]">
              <div className="absolute top-0 right-0 flex items-start gap-5">
                <span className="h-12 w-12 bg-[#fe6a5a]" />
                <Image
                  src="/projects/yonko/color-spec.svg"
                  alt="Bittersweet color spec"
                  width={214}
                  height={92}
                  className="mt-1 h-auto w-[214px]"
                />
              </div>
              <span className="absolute top-[84px] left-[42px] h-[26vh] w-px bg-[#000015]" />
              <span className="absolute top-[calc(84px+26vh)] left-[-15vw] h-px w-[calc(15vw+42px)] bg-[#000015]" />
              <span className="absolute top-[calc(84px+26vh-2px)] left-[-15vw] h-1 w-1 rounded-full bg-[#000015]" />
            </div>

            <div className="absolute right-[11%] bottom-[11%] h-[24%] w-[25%]">
              <div className="absolute bottom-0 left-0 flex items-start gap-5">
                <span className="h-12 w-12 bg-[#317dac]" />
                <Image
                  src="/projects/yonko/color-spec-blue.svg"
                  alt="Lapis Lazuli color spec"
                  width={214}
                  height={92}
                  className="mt-1 h-auto w-[214px]"
                />
              </div>
              <span className="absolute top-0 left-5 h-[10vh] w-px bg-[#000015]" />
              <span className="absolute top-0 left-[-16vw] h-px w-[calc(16vw+20px)] bg-[#000015]" />
              <span className="absolute top-[-2px] left-[-16vw] h-1 w-1 rounded-full bg-[#000015]" />
            </div>
          </section>

          <TitleInfo title="UX">
            <p>
              Building the UX the idea was as it is most of the time when we
              deal with UX to be very intuitive and simple.
            </p>
            <br />
            <p>
              Tools like storytelling, personas, future press release,
              blueprints and user flow were applied. They help find new features
              and understand the needs of the user at each moment of the booking
              and post-booking process.
            </p>
          </TitleInfo>

          <section className="grid h-full w-[1100px] shrink-0 snap-start grid-cols-[1fr_280px] gap-10 bg-[#eef1f4] p-10 text-[#34426c]">
            <div className="grid grid-cols-3 place-items-center gap-8 overflow-hidden">
              {["persona-1.png", "persona-2.png", "persona-3.png"].map(
                (persona, index) => (
                  <Image
                    key={persona}
                    src={`/projects/yonko/${persona}`}
                    alt={`Persona ${index + 1}`}
                    width={784}
                    height={1288}
                    className="h-[74vh] w-auto shadow-[0_18px_50px_rgba(52,66,108,0.08)]"
                  />
                )
              )}
            </div>
            <div className="self-center">
              <h3 className="text-[28px] leading-none font-light tracking-[0.01em]">
                Personas
              </h3>
              <p className="mt-7 text-xs leading-[1.2] font-light tracking-[0.01em]">
                By using personas we can identify our ideal target audience and
                relate to them and the issues they face. They allow us to
                understand and anticipate their needs so we can come up with
                possible solutions for them.
              </p>
            </div>
          </section>

          <ImageInfoSection
            title="Blueprint"
            image="/projects/yonko/blueprint.png"
            imageAlt="Service blueprint"
            imageClassName="h-auto w-[650px]"
            body="A Blueprint allows us to map all the actions and processes involved when using a service or product and what each actor does. With this tool, we can identify critical moments and come up with solutions."
          />

          <TitleInfo title="Golden Path" width="w-[760px]">
            <p>
              Golden Path is the fastest way for a user to do a determined
              action on an app. The booking process was divided into 5 steps:
              define locations, date and time, items, identify yourself and
              payment.
            </p>
            <br />
            <p>
              The post-booking flow is defined by waiting for the concierge,
              meeting the concierge, and tracking luggage to the final
              destination.
            </p>
          </TitleInfo>

          <TitleInfo title="UI" width="w-[700px]">
            <p>
              The visual ideas for the user interface come directly from the
              branding and the UX, keeping things simple, clean and intuitive,
              paying attention to the small details and adding illustrations to
              help the customer relate to the web app and decoding information.
            </p>
          </TitleInfo>

          <ImageInfoSection
            title="Iconography"
            image="/projects/yonko/iconography.png"
            imageAlt="Iconography sheet"
            imageClassName="h-auto max-h-[74vh] w-[620px] object-contain"
            body="For the icons, it was important that they were outlined and had a filled version. Ionicons is an open-source library with a huge variety of well-designed icons, and they make the implementation easy."
          />

          <ImageInfoSection
            title="Illustration"
            image="/projects/yonko/illustration.png"
            imageAlt="Yonko Level illustration"
            imageClassName="h-[74vh] w-auto object-contain"
            reverse
            body="The illustrations aim to make the user experience more pleasant. Similar to photos, they represent the target audience and show diversity. They were made to fit the brand with straight lines, sharp edges and almost realistic proportions."
          />

          <ImageInfoSection
            title="Components"
            image="/projects/yonko/components.png"
            imageAlt="Yonko Level interface component sheet"
            imageClassName="h-auto max-h-[72vh] w-[660px] object-contain"
            body="The components are a reflection of the design system taking shape: grids, typography, icons, illustrations and colours all getting together. They are the pieces that will compose the app screens."
          />

          <section className="grid h-full w-[920px] shrink-0 snap-start grid-cols-[300px_1fr] gap-10 bg-[#34426c] p-10 text-[#f7f5f4]">
            <div className="self-center">
              <h3 className="text-[28px] font-light leading-[1.2] tracking-[0.01em]">
                High Fidelity
                <br />
                Mobile
              </h3>
            </div>
            <div className="grid place-items-center">
              <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_20px_70px_rgba(0,0,0,0.32)]">
                <Image
                  src="/projects/yonko/mobile.jpg"
                  alt="Mobile high fidelity screen"
                  width={561}
                  height={1218}
                  className="h-[72vh] w-auto"
                />
              </div>
            </div>
          </section>
        </div>
        <HorizontalRunner containerRef={scrollerRef} />
      </div>
    </section>
  );
}
