import { useEffect, useRef, useState } from "react";
import DogCanvas from "./DogCanvas";
import { useFrames } from "@/hooks/use-frames";
import { useInView, useReducedMotion } from "@/hooks/use-motion";
import { cn } from "@/lib/utils";

export interface Clip {
  base: string;
  count: number;
  w: number;
  h: number;
}

interface Props {
  clip: Clip;
  label: string;
  /** Plays only while true (e.g. the active treatment). */
  active?: boolean;
  fps?: number;
  className?: string;
  canvasClassName?: string;
}

/** A transparent dog clip (WebP frame sequence) that loops while it is on screen. */
const DogClip = ({ clip, label, active = true, fps = 12, className, canvasClassName }: Props) => {
  const [ref, inView] = useInView<HTMLDivElement>({ rootMargin: "200px" }, false);
  const reduced = useReducedMotion();
  const [armed, setArmed] = useState(false);
  useEffect(() => { if (inView) setArmed(true); }, [inView]);
  const frames = useFrames(armed ? clip.base : "", armed ? clip.count : 0);
  const [i, setI] = useState(0);
  const playing = useRef(false);

  useEffect(() => {
    playing.current = inView && active && !reduced && frames.loaded >= clip.count * 0.6;
    if (!playing.current) return;
    // Ping-pong so clips whose last frame differs from the first never jump.
    let dir = 1;
    const id = window.setInterval(() => {
      setI((n) => {
        if (n >= clip.count - 1) dir = -1;
        else if (n <= 0) dir = 1;
        return n + dir;
      });
    }, 1000 / fps);
    return () => window.clearInterval(id);
  }, [inView, active, reduced, frames.loaded, clip.count, fps]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      {frames.loaded === 0 && (
        <img src={`${clip.base}000.webp`} alt="" aria-hidden loading="lazy" className={cn("absolute inset-0 m-auto h-auto w-full", canvasClassName)} />
      )}
      <DogCanvas
        frames={frames.frames}
        loaded={frames.loaded}
        index={i}
        width={clip.w}
        height={clip.h}
        label={label}
        className={canvasClassName}
      />
    </div>
  );
};

export default DogClip;
