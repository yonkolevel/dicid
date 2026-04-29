export type Project = {
  id: string;
  number: string;
  title: string;
  tags: string[];
  client: string;
  videoUrl: string;
};

// TODO(dicid): swap these Pexels placeholder videos for the real project work.
export const projects: Project[] = [
  {
    id: "yonko-level",
    number: "01",
    title: "Project 1",
    tags: ["Brand Strategy", "Web Design"],
    client: "Yonko Level",
    videoUrl:
      "https://videos.pexels.com/video-files/3045163/3045163-hd_1920_1080_25fps.mp4",
  },
  {
    id: "midicircuit",
    number: "02",
    title: "Project 2",
    tags: ["Identity", "Packaging"],
    client: "MidiCircuit",
    videoUrl:
      "https://videos.pexels.com/video-files/2611250/2611250-uhd_2560_1440_30fps.mp4",
  },
  {
    id: "invisible-camera",
    number: "03",
    title: "Project 3",
    tags: ["Art Direction", "Motion"],
    client: "Invisible Camera",
    videoUrl:
      "https://videos.pexels.com/video-files/4763824/4763824-uhd_2560_1440_24fps.mp4",
  },
  {
    id: "midi-scout",
    number: "04",
    title: "Project 4",
    tags: ["Brand Strategy", "Editorial"],
    client: "MIDI Scout",
    videoUrl:
      "https://videos.pexels.com/video-files/5649209/5649209-uhd_2560_1440_25fps.mp4",
  },
];
