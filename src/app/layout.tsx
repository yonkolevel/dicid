import type { Metadata } from "next";
import { Inter, Jacques_Francois, Permanent_Marker, UnifrakturCook } from "next/font/google";
import "./globals.css";
import CustomizePanel from "@/components/CustomizePanel";

// TODO(dicid): swap Inter for self-hosted Proxima Nova once .woff2 is supplied.
const proximaFallback = Inter({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-proxima",
});

const jacques = Jacques_Francois({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-jacques",
});

// TODO(dicid): swap Permanent Marker for self-hosted Sister Spray once .woff2 is supplied.
const sisterFallback = Permanent_Marker({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-sister",
});

const blackletter = UnifrakturCook({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-blackletter-source",
});

export const metadata: Metadata = {
  title: "DICID — Design Studio",
  description: "Brand strategy and web design portfolio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${proximaFallback.variable} ${jacques.variable} ${sisterFallback.variable} ${blackletter.variable}`}
    >
      <body className="min-h-screen">
        {children}
        <CustomizePanel />
      </body>
    </html>
  );
}
