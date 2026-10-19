import { Plus } from "lucide-react";
import { useRef } from "react";
import Reveal from "./Reveal";
import { useViewportProgress } from "@/hooks/use-motion";
import { media, scrollToId } from "@/lib/utils";

const FAQ = [
  {
    q: "הכלב שלי חושש ממספרות. זה יעבוד?",
    a: "ספרו לנו מראש, ונתכנן את הביקור בהתאם: יותר זמן להיכרות, עבודה בשלבים והפסקות כשצריך. לפעמים ביקור היכרות קצר הוא ההתחלה הכי נכונה.",
  },
  {
    q: "כמה זמן לוקח טיפול?",
    a: "זה תלוי בגודל, בסוג הפרווה ובמצב שלה — ובעיקר בקצב של הכלב. נעדכן אתכם בהערכת זמן כשנתאם את התור.",
  },
  {
    q: "כל כמה זמן כדאי להגיע?",
    a: "תלוי בפרווה ובתספורת. פרווה מתולתלת או ארוכה צריכה בדרך כלל טיפוח בתדירות גבוהה יותר. בסוף כל טיפול נמליץ על הזמן המתאים לביקור הבא.",
  },
  {
    q: "מאיזה גיל אפשר להביא גור?",
    a: "כדאי להתחיל מוקדם, בביקור היכרות קצר — אחרי שהגור השלים את החיסונים שהווטרינר המליץ עליהם.",
  },
  {
    q: "כמה זה עולה?",
    a: "המחיר תלוי בגודל הכלב, בסוג הטיפול ובמצב הפרווה. השאירו פרטים ונחזור אליכם עם כל המידע.",
  },
];

/** 06 — removing the last doubts while the dog keeps walking toward the booking. */
const Faq = () => {
  const ref = useRef<HTMLElement>(null);
  const p = useViewportProgress(ref);
  return (
  <section ref={ref} id="faq" className="scroll-mt-20 py-20 md:py-32" aria-labelledby="faq-title">
    <div className="container grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
      <Reveal>
        <p className="eyebrow">שאלות ששואלים אותנו</p>
        <h2 id="faq-title" className="section-title mt-4">עדיף לשאול לפני.</h2>
        <p className="lead mt-4 max-w-md">כל מה שכדאי לדעת לפני הביקור הראשון — כדי שתגיעו רגועים, ושהוא ירגיש את זה.</p>
        <div className="relative mt-10 h-40 md:h-56" aria-hidden>
          <img
            src={media("dog/side.webp")}
            alt=""
            className="absolute bottom-3 h-full w-auto object-contain will-change-transform"
            style={{ right: 0, transform: `translateX(${-p * 70}%)` }}
            loading="lazy"
          />
          <div className="absolute bottom-0 h-4 w-40 rounded-[50%] bg-primary/20 blur-lg" style={{ right: 0, transform: `translateX(${-p * 70}%)` }} />
        </div>
      </Reveal>

      <Reveal delay={120}>
        <div className="divide-y rounded-[1.75rem] border bg-card px-6 md:px-8">
          {FAQ.map((f) => (
            <details key={f.q} className="group py-5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold text-primary md:text-xl">
                {f.q}
                <Plus className="h-5 w-5 shrink-0 text-accent transition-transform duration-300 group-open:rotate-45" aria-hidden />
              </summary>
              <p className="mt-3 text-base text-muted-foreground md:text-lg">{f.a}</p>
            </details>
          ))}
        </div>
        <p className="mt-6 text-base text-muted-foreground">
          לא מצאתם תשובה?{" "}
          <button onClick={() => scrollToId("booking")} className="font-semibold text-primary underline underline-offset-4">
            כתבו לנו בטופס, ונחזור אליכם
          </button>
        </p>
      </Reveal>
    </div>
  </section>
  );
};

export default Faq;
