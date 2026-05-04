import { CustomizePanelDesktop } from "./CustomizePanel";
import SiteLogo from "./SiteLogo";

const MISSION = `Design shapes our world, blending form and function. Its impact is profound, influencing how we live and interact. Creativity fuels innovation, driving progress and sparking inspiration. Development evolves design, adapting to changing needs. Together, they propel us forward, shaping a brighter future.`;

export default function Header() {
  return (
    <header
      className="grid h-[180px] w-full shrink-0 grid-cols-[1fr_auto] items-start gap-4 p-[30px] md:grid-cols-[auto_1fr_auto_1fr_auto] md:gap-10"
      style={{ color: "var(--page-fg)" }}
    >
      <div className="flex h-full flex-col items-start justify-start gap-2 md:contents">
        <SiteLogo />

        <nav className="flex shrink-0 gap-7 text-base leading-none tracking-[0.02em] md:hidden">
          <a href="/about" className="transition-opacity hover:opacity-60">
            About
          </a>
          <a
            href="mailto:hello@dicid.tbd"
            className="transition-opacity hover:opacity-60"
          >
            Contact
          </a>
        </nav>
      </div>

      <p
        className="hidden h-full overflow-hidden text-[10px] font-bold leading-[1.45] tracking-[0.05em] uppercase md:block md:text-[11px]"
        style={{ textAlign: "justify" }}
      >
        {MISSION}
      </p>

      <nav className="hidden shrink-0 gap-4 self-start pt-2 text-xs font-bold tracking-[0.05em] uppercase md:flex md:gap-6 md:text-base">
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

      <div className="hidden md:block" aria-hidden="true" />

      <div className="justify-self-end">
        <CustomizePanelDesktop />
      </div>
    </header>
  );
}
