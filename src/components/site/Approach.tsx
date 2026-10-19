import { useRef } from "react";
import Reveal from "./Reveal";
import DogClip from "./DogClip";
import { CLIPS } from "./treatment-data";
import { useViewportProgress } from "@/hooks/use-motion";
import { scrollToId } from "@/lib/utils";

const STEPS = [
  { title: "קודם מכירים", text: "נותנים לו להריח, להסתובב ולהתרגל — ורק אז מוציאים את המספריים." },
  { title: "עוצרים כשצריך", text: "הפסקה קצרה, מים, מילה טובה. הקצב נקבע לפי הכלב, לא לפי השעון." },
  { title: "מספרים לכם מה ראינו", text: "בסוף הטיפול תשמעו איך הפרווה נראתה ומה כדאי לעשות עד הפעם הבאה." },
];

/** 05 — reassurance: the dog is fully relaxed. */
const Approach = () => {
  const ref = useRef<HTMLElement>(null);
  const p = useViewportProgress(ref);
  return (
  <section ref={ref} id="approach" className="scroll-mt-20 bg-primary py-20 text-primary-foreground md:py-32" aria-labelledby="approach-title">
    <div className="container grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
      <Reveal>
        <p className="eyebrow text-primary-foreground/70">איך אנחנו עובדים</p>
        <h2 id="approach-title" className="mt-4 text-[clamp(2.25rem,6vw,4.25rem)] font-extrabold">
          בלי למהר.
          <br />
          <span className="text-accent">בלי לחץ.</span>
        </h2>
        <p className="mt-5 max-w-lg text-lg text-primary-foreground/80 md:text-xl">
          טיפוח טוב מתחיל בכלב רגוע. לכן אנחנו לא ממהרים להתחיל — וגם לא לסיים.
        </p>

        <ol className="mt-10 space-y-7">
          {STEPS.map((s, i) => (
            <li key={s.title} className="flex gap-5">
              <span className="text-sm font-bold tabular-nums text-accent" aria-hidden>0{i + 1}</span>
              <div>
                <h3 className="text-xl font-bold">{s.title}</h3>
                <p className="mt-1 text-primary-foreground/75">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <button
          onClick={() => scrollToId("booking")}
          className="mt-10 inline-flex h-14 items-center rounded-full bg-accent px-8 text-lg font-semibold text-accent-foreground transition hover:-translate-y-0.5 hover:bg-accent/90"
        >
          יש לכם כלב רגיש? ספרו לנו
        </button>
      </Reveal>

      <Reveal delay={150} className="relative">
        <div aria-hidden className="absolute inset-[12%] rounded-full bg-accent/20 blur-3xl" />
        <div className="relative will-change-transform" style={{ transform: `translateY(${(0.5 - p) * 60}px) rotate(${(p - 0.5) * 8}deg)` }}>
          <DogClip clip={CLIPS.roll} label="פודל משמשי מתגלגל על הגב, רגוע לגמרי" className="mx-auto w-full max-w-[560px]" />
        </div>
        <div aria-hidden className="mx-auto -mt-6 h-6 w-2/3 rounded-[50%] bg-black/30 blur-xl" />
        <p className="relative mx-auto mt-6 w-fit rounded-2xl bg-background px-5 py-3 text-sm font-semibold text-primary shadow-xl">
          ככה נראה כלב שסומך עליכם.
        </p>
      </Reveal>
    </div>
  </section>
  );
};

export default Approach;
