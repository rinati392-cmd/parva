import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface Props {
  frames: HTMLImageElement[];
  index: number;
  loaded: number;
  width: number;
  height: number;
  label: string;
  className?: string;
}

/** Draws one frame of a transparent dog sequence; falls back to the nearest loaded frame. */
const DogCanvas = ({ frames, index, loaded, width, height, label, className }: Props) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx || !frames.length) return;
    let i = Math.round(Math.min(frames.length - 1, Math.max(0, index)));
    while (i > 0 && !(frames[i]?.complete && frames[i].naturalWidth)) i--;
    const img = frames[i];
    if (!img?.complete || !img.naturalWidth) return;
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);
  }, [frames, index, loaded, width, height]);

  return (
    <canvas
      ref={ref}
      width={width}
      height={height}
      role="img"
      aria-label={label}
      className={cn("block h-auto w-full", className)}
      style={{ aspectRatio: `${width} / ${height}` }}
    />
  );
};

export default DogCanvas;
