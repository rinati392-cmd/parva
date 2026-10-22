import { useRef, useState, type KeyboardEvent } from "react";
import { ArrowLeft } from "lucide-react";
import DogClip from "./DogClip";
import GroundShadow from "./GroundShadow";
import Reveal from "./Reveal";
import { TREATMENTS, type TreatmentId } from "./treatment-data";
import { cn } from "@/lib/utils";

interface Props {
  onChoose: (id: TreatmentId) => void;
}

/** 04 — four treatment buttons; each one switches the dog clip and the details. */
const TreatmentsStory = ({ onChoose }: Props) => {
  const [active, setActive] = useState(0);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const n = TREATMENTS.length;

  // Arrow keys move between tabs; in RTL, ArrowLeft is "next".
  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const step = e.key === "ArrowLeft" ? 1 : e.key === "ArrowRight" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (i + step + n) % n;
    setActive(next);
    tabsRef.current[next]?.focus();
  };

  return (
    <section id="treatments" className="scroll-mt-20 py-20 md:py-28" aria-labelledby="treatments-title">
      <div className="container">
        <Reveal>
          <p className="eyebrow">הטיפולים</p>
          <h2 id="treatments-title" className="mt-3 text-[clamp(1.9rem,5vw,3.75rem)] font-extrabold text-primary">
            ארבעה טיפולים. אף פעם לא אותו כלב.
          </h2>
        </Reveal>

        <Reveal delay={100}>
          <div role="tablist" aria-label="בחירת טיפול" className="mt-8 grid grid-cols-2 gap-2 md:flex md:flex-wrap md:gap-3">
            {TREATMENTS.map((t, i) => (
              <button
                key={t.id}
                ref={(el) => (tabsRef.current[i] = el)}
                role="tab"
                id={`treatment-tab-${t.id}`}
                aria-selected={i === active}
                aria-controls={`treatment-panel-${t.id}`}
                tabIndex={i === active ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={(e) => onKey(e, i)}
                className={cn(
                  "min-h-[52px] rounded-full border-2 px-4 py-2 text-base font-semibold leading-tight transition-all duration-300 md:px-6 md:text-lg",
                  i === active
                    ? "border-primary bg-primary text-primary-foreground shadow-[0_10px_30px_-14px_hsl(var(--primary)/.7)]"
                    : "border-primary/15 bg-card text-primary hover:border-accent hover:bg-accent/10",
                )}
              >
                {t.name}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-8 grid items-center gap-6 md:grid-cols-2 md:gap-10 lg:mt-10 lg:gap-16">
          {/* Details — first in DOM so they sit on the right in RTL */}
          <div className="relative order-2 min-h-[250px] md:order-1 lg:min-h-[300px]">
            {TREATMENTS.map((t, i) => (
              <article
                key={t.id}
                role="tabpanel"
                id={`treatment-panel-${t.id}`}
                aria-labelledby={`treatment-tab-${t.id}`}
                aria-hidden={i !== active}
                className={cn(
                  "absolute inset-0 transition-all duration-500 ease-out",
                  i === active ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
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

          {/* Dog — one clip per treatment */}
          <div className="relative order-1 mx-auto h-[240px] w-full max-w-[520px] md:order-2 md:h-[380px] lg:h-[460px]">
            <div aria-hidden className="absolute inset-[10%] rounded-full bg-accent/25 blur-3xl" />
            {TREATMENTS.map((t, i) => (
              <figure
                key={t.id}
                className={cn(
                  "absolute inset-0 flex flex-col items-center justify-end transition-all duration-500 ease-out",
                  i === active ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0",
                )}
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
      </div>
    </section>
  );
};

export default TreatmentsStory;
