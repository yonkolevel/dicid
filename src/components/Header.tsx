import { CustomizePanelDesktop } from "./CustomizePanel";

const MISSION = `Design shapes our world, blending form and function. Its impact is profound, influencing how we live and interact. Creativity fuels innovation, driving progress and sparking inspiration. Development evolves design, adapting to changing needs. Together, they propel us forward, shaping a brighter future.`;

export default function Header() {
  return (
    <header
      className="grid w-full shrink-0 grid-cols-[auto_1fr_auto] items-start gap-4 px-[20px] pt-5 pb-2 md:grid-cols-[auto_1fr_auto_auto] md:gap-10 md:px-[30px] md:pt-8 md:pb-3"
      style={{ color: "var(--page-fg)" }}
    >
      <h1 className="font-heading text-[14vw] leading-[0.85] font-black tracking-[-0.04em] md:text-[6vw]">
        DICID
      </h1>

      <p
        className="hidden self-start pt-2 text-[10px] font-bold tracking-[0.05em] uppercase leading-[1.45] md:block md:text-[11px]"
        style={{ textAlign: "justify" }}
      >
        {MISSION}
      </p>

      <nav className="flex shrink-0 gap-4 self-start pt-2 text-xs font-bold tracking-[0.05em] uppercase md:gap-6 md:text-base">
        <a href="/about" className="transition-opacity hover:opacity-60">
          About
        </a>
        {/* TODO(dicid): replace with real contact email */}
        <a
          href="mailto:hello@dicid.tbd"
          className="transition-opacity hover:opacity-60"
        >
          Contact
        </a>
      </nav>

      <div className="hidden md:block">
        <CustomizePanelDesktop />
      </div>
    </header>
  );
}
