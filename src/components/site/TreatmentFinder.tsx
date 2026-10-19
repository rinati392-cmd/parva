import { useState } from "react";
import { ArrowRight, RotateCcw, Sparkles } from "lucide-react";
import Reveal from "./Reveal";
import GroundShadow from "./GroundShadow";
import { treatmentById, type TreatmentId } from "./treatment-data";
import { cn, media } from "@/lib/utils";

type Answers = Record<string, string>;

const QUESTIONS = [
  {
    id: "coat",
    title: "איזו פרווה יש לחבר שלכם?",
    options: [
      { value: "curly", label: "מתולתלת" },
      { value: "long", label: "חלקה וארוכה" },
      { value: "short", label: "קצרה" },
      { value: "matted", label: "יש קשרים וסבך" },
    ],
  },
  {
    id: "size",
    title: "ומה הגודל?",
    options: [
      { value: "s", label: "קטן", hint: "עד 10 ק״ג" },
      { value: "m", label: "בינוני", hint: "10–25 ק״ג" },
      { value: "l", label: "גדול", hint: "מעל 25 ק״ג" },
    ],
  },
  {
    id: "goal",
    title: "מה הכי חשוב לכם הפעם?",
    options: [
      { value: "fresh", label: "שיהיה נקי ורענן" },
      { value: "cut", label: "תספורת ומראה חדש" },
      { value: "mats", label: "להיפטר מהקשרים" },
      { value: "first", label: "שיכיר את המקום בפעם הראשונה" },
    ],
  },
  {
    id: "mood",
    title: "איך הוא מרגיש עם טיפוח?",
    options: [
      { value: "calm", label: "רגוע ונהנה" },
      { value: "excited", label: "קצת נרגש" },
      { value: "anxious", label: "חושש ורגיש" },
      { value: "new", label: "עוד לא ניסה" },
    ],
  },
] as const;

function recommend(a: Answers): { id: TreatmentId; notes: string[] } {
  let id: TreatmentId = "wash";
  if (a.goal === "first" || a.mood === "new") id = "intro";
  else if (a.goal === "mats" || a.coat === "matted") id = "detangle";
  else if (a.goal === "cut") id = "cut";

  const notes: string[] = [];
  if (a.mood === "anxious") notes.push("נקדיש זמן להיכרות לפני שמתחילים, ונעצור להפסקות כמה שצריך.");
  if (a.mood === "excited") notes.push("נתחיל בכמה דקות של התרגלות, כדי שהאנרגיה תירגע לפני הטיפול.");
  if (a.coat === "curly") notes.push("פרווה מתולתלת נוטה להסתבך מהר — טיפוח קבוע שומר עליה רכה.");
  if (a.coat === "long" && id !== "detangle") notes.push("בפרווה ארוכה נקפיד על סירוק יסודי עד העור, לא רק מלמעלה.");
  if (a.size === "l") notes.push("כלב גדול צריך יותר זמן על השולחן — נתאם מראש כדי שלא נמהר.");
  if (id === "intro") notes.push("אחרי ההיכרות נוכל להמליץ יחד על הטיפול הבא.");
  return { id, notes: notes.slice(0, 2) };
}

interface Props {
  onChoose: (id: TreatmentId) => void;
}

/** 03 — the dog pauses next to the questionnaire. */
const TreatmentFinder = ({ onChoose }: Props) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const done = step >= QUESTIONS.length;
  const result = done ? recommend(answers) : null;
  const treatment = result ? treatmentById(result.id) : null;

  const pick = (qid: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
    window.setTimeout(() => setStep((s) => s + 1), 260);
  };
  const reset = () => { setAnswers({}); setStep(0); };

  return (
    <section id="finder" className="scroll-mt-20 py-20 md:py-32" aria-labelledby="finder-title">
      <div className="container grid items-center gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        <Reveal className="relative order-2 mx-auto w-full max-w-md lg:order-1">
          <div aria-hidden className="absolute inset-[8%] rounded-full bg-accent/25 blur-3xl" />
          <div className="relative h-[360px] md:h-[460px]">
            {[
              { src: media("dog/sit.webp"), alt: "פודל משמשי יושב ומחכה לתשובות שלכם", show: !done },
              { src: media("dog/bowtie.webp"), alt: "פודל משמשי עם פפיון, מוכן לטיפול", show: done },
            ].map((d) => (
              <img
                key={d.src}
                src={d.src}
                alt={d.show ? d.alt : ""}
                className={cn(
                  "absolute inset-x-0 bottom-6 mx-auto h-[88%] w-auto object-contain transition-all duration-700 ease-out",
                  d.show ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
                )}
                loading="lazy"
              />
            ))}
            <GroundShadow className="absolute inset-x-0 bottom-3 w-1/2" />
          </div>
          <p className="absolute bottom-0 right-4 rounded-2xl bg-card px-5 py-3 text-sm font-medium text-primary shadow-lg">
            {done ? "נשמע כמו תוכנית." : `שאלה ${Math.min(step + 1, QUESTIONS.length)} — אני מקשיב.`}
          </p>
        </Reveal>

        <Reveal className="order-1 lg:order-2" delay={120}>
          <p className="eyebrow">שאלון קצר · פחות מדקה</p>
          <h2 id="finder-title" className="section-title mt-4">אז מה הכי מתאים לחבר שלכם?</h2>
          <p className="lead mt-4 max-w-xl">כמה שאלות קצרות, ונעזור לכם להבין מאיפה כדאי להתחיל.</p>

          <div className="mt-8 rounded-[1.75rem] border bg-card p-6 shadow-[0_30px_60px_-40px_hsl(var(--primary)/.35)] md:p-8" aria-live="polite">
            {!done ? (
              <div key={step} className="animate-fade-up">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>שאלה {step + 1} מתוך {QUESTIONS.length}</span>
                  {step > 0 && (
                    <button onClick={() => setStep((s) => s - 1)} className="inline-flex items-center gap-1 font-medium text-primary hover:underline">
                      <ArrowRight className="h-4 w-4" aria-hidden /> חזרה
                    </button>
                  )}
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-accent transition-all duration-500" style={{ width: `${(step / QUESTIONS.length) * 100}%` }} />
                </div>
                <h3 id={`q-${step}`} className="mt-6 text-2xl font-bold text-primary md:text-3xl">{QUESTIONS[step].title}</h3>
                <div role="radiogroup" aria-labelledby={`q-${step}`} className="mt-5 grid gap-3 sm:grid-cols-2">
                  {QUESTIONS[step].options.map((o) => {
                    const selected = answers[QUESTIONS[step].id] === o.value;
                    return (
                      <button
                        key={o.value}
                        role="radio"
                        aria-checked={selected}
                        onClick={() => pick(QUESTIONS[step].id, o.value)}
                        className={cn(
                          "flex min-h-[64px] flex-col items-start justify-center rounded-2xl border-2 px-5 py-3 text-start text-lg font-semibold transition-all duration-200",
                          selected ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-accent hover:bg-accent/10",
                        )}
                      >
                        {o.label}
                        {"hint" in o && <span className={cn("text-sm font-normal", selected ? "text-primary-foreground/80" : "text-muted-foreground")}>{o.hint}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              treatment && result && (
                <div className="animate-fade-up">
                  <p className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-3 py-1 text-sm font-semibold text-primary">
                    <Sparkles className="h-4 w-4" aria-hidden /> ההמלצה שלנו
                  </p>
                  <h3 className="mt-4 text-3xl font-extrabold text-primary md:text-4xl">{treatment.name}</h3>
                  <p className="mt-3 text-lg text-muted-foreground">{treatment.description}</p>
                  {result.notes.length > 0 && (
                    <ul className="mt-5 space-y-2">
                      {result.notes.map((n) => (
                        <li key={n} className="flex gap-3 text-base">
                          <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                          {n}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <button onClick={() => onChoose(treatment.id)} className="btn-primary">שומרים לו מקום</button>
                    <button onClick={reset} className="inline-flex items-center justify-center gap-2 px-4 py-3 font-medium text-primary hover:underline">
                      <RotateCcw className="h-4 w-4" aria-hidden /> לענות מחדש
                    </button>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">זו המלצה ראשונית — את הפרטים נדייק יחד כשנכיר את הכלב.</p>
                </div>
              )
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default TreatmentFinder;
