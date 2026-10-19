import type { Clip } from "./DogClip";

/** Transparent dog clips (generated with Magnific, background removed locally). */
export const CLIPS = {
  towel: { base: "/media/seq/towel/", count: 61, w: 560, h: 735 },
  bowtie: { base: "/media/seq/bowtie/", count: 61, w: 560, h: 842 },
  shake: { base: "/media/seq/shake/", count: 61, w: 560, h: 700 },
  wave: { base: "/media/seq/wave/", count: 61, w: 560, h: 775 },
  roll: { base: "/media/seq/roll/", count: 61, w: 640, h: 453 },
} satisfies Record<string, Clip>;

export type TreatmentId = "wash" | "cut" | "detangle" | "intro";

export interface Treatment {
  id: TreatmentId;
  name: string;
  tagline: string;
  description: string;
  image: string;
  clip: Clip;
  imageAlt: string;
}

export const TREATMENTS: Treatment[] = [
  {
    id: "wash",
    name: "רחצה, ייבוש וסירוק",
    tagline: "למי שצריך בעיקר להרגיש רענן",
    description: "שמפו שמתאים לסוג הפרווה, ייבוש עדין וסירוק יסודי עד הקצוות.",
    image: "/media/dog/towel.webp",
    clip: CLIPS.towel,
    imageAlt: "פודל משמשי עטוף במגבת ירוקה אחרי רחצה",
  },
  {
    id: "cut",
    name: "תספורת ועיצוב",
    tagline: "מראה מסודר שנשאר יפה גם בבית",
    description: "תספורת מלאה לפי מבנה הגוף, סוג הפרווה ואורח החיים — ולפי מה שאתם אוהבים לראות.",
    image: "/media/dog/bowtie.webp",
    clip: CLIPS.bowtie,
    imageAlt: "פודל משמשי מסופר עם פפיון ירוק",
  },
  {
    id: "detangle",
    name: "התרת קשרים",
    tagline: "סבלנות במקום משיכות",
    description: "עבודה איטית ועדינה על פרווה דחוסה. כשאין ברירה אלא לקצר — נסביר לכם קודם למה.",
    image: "/media/dog/shake.webp",
    clip: CLIPS.shake,
    imageAlt: "פודל משמשי מנער את הפרווה",
  },
  {
    id: "intro",
    name: "היכרות ראשונה",
    tagline: "לגורים ולמי שזו להם הפעם הראשונה",
    description: "ביקור קצר עם הרבה הפסקות, כדי להכיר את המקום, את הכלים ואת הרעשים — בלי לחץ.",
    image: "/media/dog/wave.webp",
    clip: CLIPS.wave,
    imageAlt: "גור פודל מרים כף רגל לשלום",
  },
];

export const treatmentById = (id: TreatmentId) => TREATMENTS.find((t) => t.id === id)!;
