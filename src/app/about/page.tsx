import type { Metadata } from "next";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "About — DICID",
  description: "Behind the work at DICID — brand strategy and web design.",
};

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const ABOUT_TEXT = `Allow miles wound place the leave had. To sitting subject no improve studied limited. Ye indulgence unreserved connection alteration appearance my an astonished. Up as seen sent make he they of. Her raising and himself pasture believe females. Fancy she stuff after aware merit small his. Charmed esteems luckily age out.`;

const INTERESTS = [
  "Allow miles",
  "Sitting subject",
  "No improve studied",
  "Limited Ye indulgence",
  "Unreserved connection",
  "Alteration appearance",
];

const RECOMMENDATIONS = [
  {
    quote:
      "Allow miles wound place the leave had. To sitting subject no improve studied limited. Ye indulgence unreserved connection alteration appearance my an astonished.",
    name: "Client Name",
    role: "Role, Company",
  },
  {
    quote:
      "Allow miles wound place the leave had. To sitting subject no improve studied limited. Ye indulgence unreserved connection alteration appearance my an astonished.",
    name: "Client Name",
    role: "Role, Company",
  },
  {
    quote:
      "Allow miles wound place the leave had. To sitting subject no improve studied limited. Ye indulgence unreserved connection alteration appearance my an astonished.",
    name: "Client Name",
    role: "Role, Company",
  },
  {
    quote:
      "Allow miles wound place the leave had. To sitting subject no improve studied limited. Ye indulgence unreserved connection alteration appearance my an astonished.",
    name: "Client Name",
    role: "Role, Company",
  },
];

/* ------------------------------------------------------------------ */
/*  Social Icons (inline SVGs)                                         */
/* ------------------------------------------------------------------ */

function XIcon() {
  return (
    <svg width="22" height="20" viewBox="0 0 45 40" fill="none" aria-hidden="true">
      <path
        d="M34.844 0H41.6L26.844 16.978L44.267 40H30.578L19.911 26.044L7.644 40H0.889L16.711 21.867L0 0H14.044L23.733 12.8L34.844 0ZM32.444 35.911H36.178L12 3.822H7.911L32.444 35.911Z"
        fill="var(--page-fg)"
      />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="24" height="20" viewBox="0 0 48 40" fill="none" aria-hidden="true">
      <g clipPath="url(#li-clip)">
        <path
          d="M34.405 33.802h-5.937V24.597c0-2.195-.04-5.021-3.087-5.021-3.092 0-3.565 2.391-3.565 4.86v9.366h-5.937V14.871h5.7v2.587h.08c.57-.965 1.394-1.76 2.384-2.298.99-.539 2.11-.801 3.239-.76 6.017 0 7.126 3.92 7.126 9.018l-.003 10.384Z"
          fill="var(--page-fg)"
        />
        <path
          d="M9.18 12.284a3.424 3.424 0 1 1-.001-6.848 3.424 3.424 0 0 1 .001 6.848ZM12.149 33.802H6.206V14.871h5.943v18.931ZM37.365.002H3.223a2.953 2.953 0 0 0-2.957 2.86v33.946a2.955 2.955 0 0 0 2.957 2.863h34.142a2.956 2.956 0 0 0 2.968-2.863V2.86A2.954 2.954 0 0 0 37.365.002Z"
          fill="var(--page-fg)"
        />
      </g>
      <defs>
        <clipPath id="li-clip">
          <rect width="47.385" height="40" fill="white" transform="translate(.267)" />
        </clipPath>
      </defs>
    </svg>
  );
}

function BehanceIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 41 40" fill="none" aria-hidden="true">
      <g clipPath="url(#be-clip)">
        <rect x=".651" width="40" height="40" rx="4" fill="var(--page-fg)" />
        <path
          d="M18.339 19.188s2.25-.188 2.25-2.813c0-2.625-1.813-3.875-4.125-3.875H8.776v14.75h7.688s4.688.125 4.688-4.375c-.063 0 .188-3.688-2.813-3.688Zm-6.188-4.063h4.313s1.062 0 1.062 1.563-1.187 1.75-1.875 1.75h-3.5v-3.313Zm4.063 9.438h-4.063v-3.938h4.313s1.562 0 1.562 2c-.062 1.75-1.937 1.938-2.562 1.938Z"
          fill="#fff"
        />
        <path d="M30.276 13.375h-6.062v1.813h6.062v-1.813Z" fill="#fff" />
        <path
          d="M27.339 16.25c-5.688 0-5.688 5.688-5.688 5.688s-.374 5.625 5.687 5.625c0 0 5.063.312 5.063-3.938h-2.625s.062 1.563-2.375 1.563c0 0-2.625.187-2.625-2.563h7.625c.063 0 .938-6.375-5.063-6.375Zm-2.5 4.375s.313-2.25 2.563-2.25c2.25 0 2.25 2.25 2.25 2.25h-4.813Z"
          fill="#fff"
        />
      </g>
      <defs>
        <clipPath id="be-clip">
          <rect width="40" height="40" fill="white" transform="translate(.651)" />
        </clipPath>
      </defs>
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="6" stroke="var(--page-fg)" strokeWidth="1.5"/>
      <circle cx="12" cy="12" r="5" stroke="var(--page-fg)" strokeWidth="1.5"/>
      <circle cx="18" cy="6" r="1.5" fill="var(--page-fg)"/>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Components                                                         */
/* ------------------------------------------------------------------ */

function PortraitImage({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <img
      src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cdefs%3E%3ClinearGradient id='g1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23ff4d4d'/%3E%3Cstop offset='25%25' stop-color='%23f9cb28'/%3E%3Cstop offset='50%25' stop-color='%23c841ff'/%3E%3Cstop offset='75%25' stop-color='%2329b6ff'/%3E%3Cstop offset='100%25' stop-color='%23ff4d4d'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='200' height='200' fill='url(%23g1)'/%3E%3C/svg%3E"
      alt="Placeholder"
      className={`block ${className ?? ""}`}
      style={{
        borderRadius: "2px",
        objectFit: "cover",
        ...style,
      }}
    />
  );
}

function CirclePortrait({ className }: { className?: string }) {
  return (
    <img
      src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cdefs%3E%3ClinearGradient id='g1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23ff4d4d'/%3E%3Cstop offset='25%25' stop-color='%23f9cb28'/%3E%3Cstop offset='50%25' stop-color='%23c841ff'/%3E%3Cstop offset='75%25' stop-color='%2329b6ff'/%3E%3Cstop offset='100%25' stop-color='%23ff4d4d'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='200' height='200' fill='url(%23g1)'/%3E%3C/svg%3E"
      alt="Placeholder"
      className={`block shrink-0 rounded-full ${className ?? ""}`}
      style={{ objectFit: "cover" }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function AboutPage() {
  return (
    <main className="flex min-h-[100dvh] w-full flex-col">
      <Header />

      {/* ════════════════════════════════════════════════════════════
          ABOUT SECTION
          ════════════════════════════════════════════════════════════ */}
      <section className="px-[20px] pt-16 md:px-[30px] md:pt-24">
        <div className="mx-auto grid w-full max-w-[1200px] gap-12 md:grid-cols-2 md:gap-16">
          {/* ── Left: text content ── */}
          <div className="flex flex-col gap-12">
            {/* Heading + body */}
            <div className="flex flex-col gap-6">
              <h1
                className="text-3xl font-bold uppercase leading-[1.1] tracking-tight md:text-4xl"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Behind the work
              </h1>
              <p
                className="max-w-[460px] text-sm font-medium uppercase leading-relaxed tracking-wide"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {ABOUT_TEXT}
              </p>
            </div>

            {/* Tools + Interests */}
            <div className="grid grid-cols-2 gap-8">
              <div className="flex flex-col gap-3">
                <h2
                  className="text-sm font-bold uppercase tracking-wide"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  Tools
                </h2>
                <p
                  className="text-sm font-medium uppercase leading-relaxed tracking-wide"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  Whatever gets the job done.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <h2
                  className="text-sm font-bold uppercase tracking-wide"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  Interests
                </h2>
                <ul className="flex flex-col">
                  {INTERESTS.map((item, i) => (
                    <li
                      key={i}
                      className="text-sm font-medium uppercase leading-relaxed tracking-wide"
                      style={{ fontFamily: "var(--font-sans)" }}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* ── Right: vertical images ── */}
          <div className="relative flex justify-end gap-4 md:gap-6">
            <PortraitImage className="aspect-[3/5] w-[45%] max-w-[260px]" />
            <PortraitImage className="aspect-[3/5] w-[35%] max-w-[200px] self-start mt-12" />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          RECOMMENDATIONS
          ════════════════════════════════════════════════════════════ */}
      <section className="px-[20px] pt-20 md:px-[30px] md:pt-32">
        <div className="mx-auto flex max-w-[1200px] flex-col items-end gap-8 md:gap-12">
          <h2
            className="text-sm font-bold uppercase tracking-wide"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Recommendations
          </h2>

          {/* Recommendation card */}
          <div className="flex max-w-[540px] items-start gap-5">
            <CirclePortrait className="h-14 w-14 md:h-16 md:w-16" />
            <p
              className="text-sm font-medium uppercase leading-relaxed tracking-wide"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Allow miles wound place the leave had. To sitting subject no improve studied limited. Ye indulgence unreserved connection alteration appearance my an astonished.
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          CONTACT — Massive CTA + scattered images
          ════════════════════════════════════════════════════════════ */}
      <section className="relative px-[20px] pt-24 md:px-[30px] md:pt-40">
        <div className="relative mx-auto w-full max-w-[1200px]">
          {/* Scattered images around the CTA */}
          <PortraitImage className="absolute left-[2%] top-[5%] aspect-[3/4] w-[10vw] max-w-[120px] md:left-[4%]" />
          <PortraitImage className="absolute right-[5%] top-0 aspect-[4/3] w-[22vw] max-w-[300px] md:right-[8%]" />
          <PortraitImage className="absolute left-[8%] bottom-[5%] aspect-[3/4] w-[16vw] max-w-[200px] md:left-[10%]" />
          <PortraitImage className="absolute right-[15%] bottom-[15%] aspect-[4/3] w-[12vw] max-w-[150px]" />
          <PortraitImage className="absolute left-[42%] bottom-0 aspect-square w-[14vw] max-w-[180px]" />

          {/* Massive CTA text */}
          <div className="relative z-10 flex flex-col gap-2 py-[8vw] md:py-[6vw]">
            <p
              className="text-[8vw] font-bold uppercase leading-[0.95] tracking-tight md:text-[5.5vw]"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Say something Daring
              <br />
              here...
            </p>
            <a
              href="mailto:delcio@dicid.com"
              className="mt-4 text-[6vw] font-medium uppercase leading-[1] tracking-tight transition-opacity hover:opacity-60 md:text-[4vw]"
              style={{ fontFamily: "var(--font-sans)", color: "var(--page-fg)", textDecoration: "none" }}
            >
              delcio@dicid.com
            </a>
          </div>

          {/* Anti-socials — bottom right */}
          <div className="relative z-10 flex flex-col items-end gap-4 pb-24 md:pb-16">
            <p
              className="text-sm font-bold uppercase tracking-wide"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Anti-socials
            </p>
            <div className="flex items-center gap-5">
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-60"
                aria-label="X (Twitter)"
              >
                <XIcon />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-60"
                aria-label="LinkedIn"
              >
                <LinkedInIcon />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-60"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://behance.net"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-60"
                aria-label="Behance"
              >
                <BehanceIcon />
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
