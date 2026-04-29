export default function Header() {
  return (
    <header
      className="w-full shrink-0 px-[30px] pt-6 pb-2 md:pt-8"
      style={{ color: "var(--page-fg)" }}
    >
      <div className="flex items-start justify-between gap-12">
        <h1 className="font-heading text-[12vw] leading-[0.85] font-black tracking-[-0.04em] md:text-[10vw]">
          DICID
        </h1>
        <nav className="mt-3 flex shrink-0 gap-6 text-xs font-bold tracking-[0.1em] uppercase md:text-sm">
          <a href="#about" className="transition-opacity hover:opacity-60">
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
      </div>
    </header>
  );
}
