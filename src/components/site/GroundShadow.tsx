import { cn } from "@/lib/utils";

/** Soft contact shadow that grounds a cut-out dog on the cream page. */
const GroundShadow = ({ className }: { className?: string }) => (
  <div
    aria-hidden
    className={cn("pointer-events-none mx-auto h-6 w-3/4 rounded-[50%] bg-primary/25 blur-xl", className)}
  />
);

export default GroundShadow;
