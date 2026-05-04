"use client";

import Image from "next/image";
import Link from "next/link";
import { useCustomise } from "@/lib/customise";

const LOGOS: Record<string, string> = {
  sans: "/logos/dicid-logo-sans.svg",
  serif: "/logos/dicid-logo-serif.svg",
  handwritten: "/logos/dicid-logo-handwritten.svg",
  blackletter: "/logos/dicid-logo-blackletter.svg",
};

export default function SiteLogo() {
  const { font, color } = useCustomise();
  const logoSrc = LOGOS[font] ?? LOGOS.sans;
  const isLightLogo = color === "blue" || color === "navy";

  return (
    <Link
      href="/"
      aria-label="DICID home"
      className="block w-[43vw] max-w-[260px] shrink-0 transition-opacity hover:opacity-70 md:w-[18vw] md:max-w-[360px]"
      style={{ color: "var(--page-fg)" }}
    >
      <Image
        src={logoSrc}
        alt="DICID"
        width={720}
        height={220}
        priority
        className="h-auto w-full"
        style={{ filter: isLightLogo ? "invert(1)" : "none" }}
      />
    </Link>
  );
}
