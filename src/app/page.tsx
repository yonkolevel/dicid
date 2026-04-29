import Header from "@/components/Header";
import ProjectsStage from "@/components/ProjectsStage";

export default function Home() {
  return (
    <main className="flex h-screen w-full flex-col overflow-hidden">
      <Header />
      <ProjectsStage />
    </main>
  );
}
