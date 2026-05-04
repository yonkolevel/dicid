import type { Metadata } from "next";
import { Jacques_Francois } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { CustomizePanelMobile } from "@/components/CustomizePanel";
import DevDesignInspector from "@/components/DevDesignInspector";

const jacques = Jacques_Francois({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-jacques",
});

const sisterSpray = localFont({
  src: "../../public/fonts/SisterSpray.ttf",
  variable: "--font-sister",
  display: "swap",
});

const vorname = localFont({
  src: "../../public/fonts/Vorname.ttf",
  variable: "--font-vorname",
  display: "swap",
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
      className={`${jacques.variable} ${sisterSpray.variable} ${vorname.variable}`}
    >
      <head>
        {/* Proxima Nova via Adobe Typekit */}
        <link rel="stylesheet" href="https://use.typekit.net/cxs7cow.css" />
      </head>
      <body className="min-h-screen">
        {children}
        <CustomizePanelMobile />
        {process.env.NODE_ENV === "development" && <DevDesignInspector />}
      </body>
    </html>
  );
}
