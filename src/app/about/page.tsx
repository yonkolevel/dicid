import Header from "@/components/Header";

export default function AboutPage() {
  return (
    <main className="flex min-h-[100dvh] w-full flex-col">
      <Header />
      <section className="flex-1 px-[20px] pb-[160px] md:px-[30px] md:pb-[60px]">
        <div className="mx-auto flex w-full max-w-[760px] flex-col gap-10 pt-12 md:pt-20">
          <h2
            className="font-heading text-5xl font-black tracking-[-0.02em] md:text-7xl"
            style={{ color: "var(--page-fg)" }}
          >
            About
          </h2>

          <p
            className="text-base leading-relaxed md:text-lg"
            style={{ color: "var(--page-fg)" }}
          >
            DICID is a one-person studio working at the intersection of brand
            strategy and web design. We help small teams sharpen what they
            stand for and turn it into work the world actually meets — websites,
            identities, and the systems behind them.
          </p>

          <p
            className="text-base leading-relaxed md:text-lg"
            style={{ color: "var(--page-fg)" }}
          >
            Selected projects live on the home page. If a collaboration is
            calling, drop a line.
          </p>

          <a
            href="mailto:hello@dicid.tbd"
            className="dicid-link text-sm font-bold tracking-[0.18em] uppercase"
          >
            hello@dicid.tbd
          </a>
        </div>
      </section>
    </main>
  );
}
