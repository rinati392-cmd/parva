import { useState, type FormEvent } from "react";
import { Check } from "lucide-react";
import Reveal from "./Reveal";
import { CLIPS, TREATMENTS, type TreatmentId } from "./treatment-data";
import GroundShadow from "./GroundShadow";
import DogClip from "./DogClip";

interface Props {
  treatment: TreatmentId | "";
  onTreatmentChange: (id: TreatmentId | "") => void;
}

const field =
  "mt-2 block w-full rounded-2xl border-2 border-input bg-background px-4 py-3 text-lg text-foreground placeholder:text-muted-foreground/70 transition focus:border-primary focus:outline-none";
const label = "text-base font-semibold text-primary";

/** 07 — the story closes where it began: the dog sits and looks at you again. */
const Booking = ({ treatment, onTreatmentChange }: Props) => {
  const [sent, setSent] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const phone = String(data.get("phone") ?? "").replace(/[\s-]/g, "");
    if (!/^(\+972|0)5\d{8}$|^0[2-9]\d{7}$/.test(phone)) {
      setPhoneError("נראה שחסרה ספרה. נסו שוב, למשל 050-1234567");
      return;
    }
    setPhoneError("");
    // TODO: connect to a backend (e.g. Lovable Cloud / Supabase table or email) — requests are not sent anywhere yet.
    console.info("booking request", Object.fromEntries(data));
    setSent(true);
  };

  return (
    <section id="booking" className="scroll-mt-20 bg-accent/20 py-20 md:py-32" aria-labelledby="booking-title">
      <div className="container grid items-start gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <Reveal className="lg:sticky lg:top-28">
          <p className="eyebrow">קובעים תור</p>
          <h2 id="booking-title" className="section-title mt-4">השולחן מוכן. רק חסר הוא.</h2>
          <p className="lead mt-4 max-w-md">השאירו פרטים ונחזור אליכם לתאם מועד שנוח לכם — וגם לו.</p>
          <div className="relative mt-8 max-w-sm">
            <div aria-hidden className="absolute inset-[12%] rounded-full bg-background/70 blur-3xl" />
            <DogClip clip={CLIPS.wave} label="פודל משמשי מנופף לכם לשלום" className="relative mx-auto flex h-[300px] justify-center md:h-[380px]" canvasClassName="h-full w-auto" />
            <GroundShadow className="-mt-4 w-1/2" />
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="rounded-[2rem] bg-card p-6 shadow-[0_40px_80px_-50px_hsl(var(--primary)/.5)] md:p-10">
            {sent ? (
              <div className="animate-fade-up py-10 text-center" role="status">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-8 w-8" aria-hidden />
                </span>
                <h3 className="mt-6 text-3xl font-extrabold text-primary">קיבלנו. הוא כבר בדרך אלינו.</h3>
                <p className="mt-3 text-lg text-muted-foreground">נחזור אליכם בהקדם כדי לתאם מועד.</p>
                <button onClick={() => setSent(false)} className="mt-8 font-semibold text-primary underline underline-offset-4">
                  שליחת בקשה נוספת
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2" noValidate={false}>
                <label className="sm:col-span-1">
                  <span className={label}>השם שלכם</span>
                  <input name="name" required autoComplete="name" className={field} placeholder="שם מלא" />
                </label>
                <label className="sm:col-span-1">
                  <span className={label}>טלפון</span>
                  <input
                    name="phone"
                    type="tel"
                    required
                    inputMode="tel"
                    autoComplete="tel"
                    dir="ltr"
                    className={`${field} text-right`}
                    placeholder="050-0000000"
                    aria-invalid={!!phoneError}
                    aria-describedby={phoneError ? "phone-error" : undefined}
                  />
                  {phoneError && <span id="phone-error" className="mt-1 block text-sm text-red-700">{phoneError}</span>}
                </label>
                <label>
                  <span className={label}>איך קוראים לכלב?</span>
                  <input name="dogName" className={field} placeholder="למשל: שוקו" />
                </label>
                <label>
                  <span className={label}>גודל</span>
                  <select name="size" className={field} defaultValue="">
                    <option value="" disabled>בחרו גודל</option>
                    <option value="small">קטן (עד 10 ק״ג)</option>
                    <option value="medium">בינוני (10–25 ק״ג)</option>
                    <option value="large">גדול (מעל 25 ק״ג)</option>
                  </select>
                </label>
                <label className="sm:col-span-2">
                  <span className={label}>איזה טיפול?</span>
                  <select
                    name="treatment"
                    className={field}
                    value={treatment}
                    onChange={(e) => onTreatmentChange(e.target.value as TreatmentId | "")}
                  >
                    <option value="">עוד לא בטוחים — נחליט יחד</option>
                    {TREATMENTS.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </label>
                <label className="sm:col-span-2">
                  <span className={label}>משהו שחשוב לנו לדעת?</span>
                  <textarea
                    name="notes"
                    rows={3}
                    className={field}
                    placeholder="גיל, גזע, רגישויות, ימים ושעות שנוחים לכם"
                  />
                </label>
                <div className="sm:col-span-2">
                  <button type="submit" className="btn-primary w-full">שולחים בקשה לתור</button>
                  <p className="mt-3 text-center text-sm text-muted-foreground">בלי התחייבות. נחזור אליכם לתיאום.</p>
                </div>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Booking;
