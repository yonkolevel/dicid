import { Composition } from "remotion";
import { YonkoLevelReel } from "./YonkoLevelReel";

export function RemotionRoot() {
  return (
    <Composition
      id="YonkoLevelReel"
      component={YonkoLevelReel}
      durationInFrames={360}
      fps={30}
      width={1920}
      height={1080}
    />
  );
}
