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

/** Seconds elapsed while `active`, ticking at `fps` (resets when it stops). */
export function useClock(active: boolean, fps: number) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!active) { setT(0); return; }
    let raf = 0;
    let last = -1;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = (now - start) / 1000;
      const frame = Math.floor(elapsed * fps);
      if (frame !== last) { last = frame; setT(elapsed); }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, fps]);
  return t;
}

/**
 * Plays once: seconds elapsed since `trigger` became true, clamped to `duration`.
 * Stops ticking at the end; resets to 0 when `trigger` turns false (so it can replay).
 */
export function usePlayOnce(trigger: boolean, duration: number) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!trigger) { setT(0); return; }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = Math.min(duration, (now - start) / 1000);
      setT(elapsed);
      if (elapsed < duration) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [trigger, duration]);
  return t;
}
