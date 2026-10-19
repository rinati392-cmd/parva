import { useRef } from "react";
import { ArrowLeft } from "lucide-react";
import DogClip from "./DogClip";
import GroundShadow from "./GroundShadow";
import { TREATMENTS, type TreatmentId } from "./treatment-data";
import { useScrollProgress } from "@/hooks/use-motion";
import { cn } from "@/lib/utils";

interface Props {
  onChoose: (id: TreatmentId) => void;
}

/** 04 — pinned: every scroll step puts the dog in a new treatment moment. */
const TreatmentsStory = ({ onChoose }: Props) => {
  const sectionRef = useRef<HTMLElement>(null);
  const p = useScrollProgress(sectionRef);
  const n = TREATMENTS.length;
  const active = Math.min(n - 1, Math.floor(p * n));

  const jumpTo = (i: number) => {
    const el = sectionRef.current;
    if (!el) return;
    const top = el.offsetTop + ((el.offsetHeight - window.innerHeight) * (i + 0.5)) / n;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <section ref={sectionRef} id="treatments" className="relative h-[400vh]" aria-labelledby="treatments-title">
      <div className="sticky top-0 flex h-[100dvh] flex-col overflow-hidden pt-20 md:pt-24">
        <div className="container">
          <p className="eyebrow">הטיפולים</p>
          <h2 id="treatments-title" className="mt-3 text-[clamp(1.9rem,5vw,3.75rem)] font-extrabold text-primary">
            ארבעה טיפולים. אף פעם לא אותו כלב.
          </h2>
        </div>

        <div className="container grid flex-1 items-center gap-4 pb-6 lg:grid-cols-2 lg:gap-16 lg:pb-10">
          {/* Text — first in DOM so it sits on the right in RTL */}
          <div className="relative order-2 min-h-[230px] lg:order-1 lg:min-h-[320px]">
            {TREATMENTS.map((t, i) => (
              <article
                key={t.id}
                aria-hidden={i !== active}
                className={cn(
                  "absolute inset-0 transition-all duration-700 ease-out",
                  i === active ? "translate-y-0 opacity-100" : i < active ? "-translate-y-6 opacity-0" : "translate-y-6 opacity-0",
                  i !== active && "pointer-events-none",
                )}
              >
                <p dir="ltr" className="text-end text-sm font-bold tabular-nums text-accent">0{i + 1} / 0{n}</p>
                <h3 className="mt-2 text-[clamp(1.75rem,4vw,3rem)] font-extrabold text-primary">{t.name}</h3>
                <p className="mt-1 text-lg font-semibold text-primary/70">{t.tagline}</p>
                <p className="mt-3 max-w-md text-lg text-muted-foreground">{t.description}</p>
                <button
                  onClick={() => onChoose(t.id)}
                  tabIndex={i === active ? 0 : -1}
                  className="group mt-5 inline-flex items-center gap-2 text-lg font-semibold text-primary underline-offset-4 hover:underline"
                >
                  זה מה שהוא צריך
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" aria-hidden />
                </button>
              </article>
            ))}
          </div>

          {/* Dog states */}
          <div className="relative order-1 mx-auto h-[34vh] w-full max-w-[520px] lg:order-2 lg:h-[58vh]">
            <div aria-hidden className="absolute inset-[10%] rounded-full bg-accent/25 blur-3xl" />
            {TREATMENTS.map((t, i) => (
              <figure
                key={t.id}
                className={cn(
                  "absolute inset-0 flex flex-col items-center justify-end transition-all duration-700 ease-out",
                  i === active ? "scale-100 opacity-100" : "scale-90 opacity-0",
                )}
                style={{ transform: i === active ? undefined : `translateY(${i < active ? -20 : 20}px) scale(.9)` }}
              >
                <DogClip
                  clip={t.clip}
                  label={t.imageAlt}
                  active={i === active}
                  className="flex min-h-0 flex-1 items-end justify-center"
                  canvasClassName="h-full w-auto max-w-full"
                />
                <GroundShadow className="-mt-4 w-1/2" />
              </figure>
            ))}
          </div>
        </div>

        <nav aria-label="מעבר בין הטיפולים" className="container flex justify-center gap-2 pb-6 lg:justify-start">
          {TREATMENTS.map((t, i) => (
            <button
              key={t.id}
              onClick={() => jumpTo(i)}
              aria-label={t.name}
              aria-current={i === active}
              className={cn("h-2 rounded-full transition-all duration-500", i === active ? "w-10 bg-primary" : "w-2 bg-primary/25 hover:bg-primary/50")}
            />
          ))}
        </nav>
      </div>
    </section>
  );
};

export default TreatmentsStory;
