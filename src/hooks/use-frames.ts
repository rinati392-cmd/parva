import { useEffect, useRef, useState } from "react";

const pad = (n: number) => String(n).padStart(3, "0");

/** Preloads a numbered WebP frame sequence (000.webp, 001.webp …) with alpha. */
export function useFrames(base: string, count: number) {
  const frames = useRef<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoaded(0);
    if (!base || !count) { frames.current = []; return; }
    frames.current = Array.from({ length: count }, (_, i) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => !cancelled && setLoaded((n) => n + 1);
      img.src = `${base}${pad(i)}.webp`;
      return img;
    });
    return () => { cancelled = true; };
  }, [base, count]);

  return { frames: frames.current, loaded };
}

/** Ping-pong frame counter for idle loops (breathing, blinking). */
export function useIdleLoop(from: number, to: number, fps: number, active: boolean) {
  const [i, setI] = useState(from);
  useEffect(() => {
    if (!active) return;
    let dir = 1;
    let cur = from;
    const id = window.setInterval(() => {
      if (cur >= to) dir = -1;
      else if (cur <= from) dir = 1;
      cur += dir;
      setI(cur);
    }, 1000 / fps);
    return () => window.clearInterval(id);
  }, [from, to, fps, active]);
  return i;
}
