export type Project = {
  id: string;
  name: string;
  tags: string[];
  client: string;
  videoUrl: string;
  href?: string;
};

// Yonko Level is the first real case-study page; the others keep the landing
// page feeling like a fuller portfolio while their custom project pages are built.
export const projects: Project[] = [
  {
    id: "yonko-level",
    name: "Yonko Level",
    tags: ["Brand Strategy", "Web Design"],
    client: "Yonko Level",
    videoUrl: "/projects/yonko/reel.mp4",
    href: "/project-yonkolevel",
  },
  {
    id: "beta",
    name: "Beta",
    tags: ["Identity", "Packaging"],
    client: "MidiCircuit",
    videoUrl:
      "https://videos.pexels.com/video-files/2611250/2611250-uhd_2560_1440_30fps.mp4",
  },
  {
    id: "gamma",
    name: "Gamma",
    tags: ["Art Direction", "Motion"],
    client: "Invisible Camera",
    videoUrl:
      "https://videos.pexels.com/video-files/4763824/4763824-uhd_2560_1440_24fps.mp4",
  },
];
