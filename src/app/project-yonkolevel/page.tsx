import type { Metadata } from "next";
import Header from "@/components/Header";
import YonkoHorizontalProject from "@/components/YonkoHorizontalProject";

export const metadata: Metadata = {
  title: "Yonko Level — DICID",
  description: "A horizontal DICID project page for the Yonko Level identity and web system.",
};

export default function YonkoLevelPage() {
  return (
    <main className="flex h-[100dvh] w-full flex-col overflow-hidden bg-[#eef1f4] text-[#000015]">
      <Header />
      <YonkoHorizontalProject />
    </main>
  );
}
