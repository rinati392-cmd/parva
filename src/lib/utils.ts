import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const scrollToId = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

/** Public media URL that respects Vite's `base` (needed for GitHub Pages sub-path hosting). */
export const media = (path: string) => `${import.meta.env.BASE_URL}media/${path}`;
