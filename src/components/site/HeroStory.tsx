import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import DogCanvas from "./DogCanvas";
import GroundShadow from "./GroundShadow";
import { useFrames, useIdleLoop, usePlayOnce } from "@/hooks/use-frames";
import { range, useMediaQuery, useReducedMotion, useScrollProgress } from "@/hooks/use-motion";
import { cn, media, scrollToId } from "@/lib/utils";

const SIT = { base: media("seq/sit/"), count: 97, w: 560, h: 538 };
const WALK = { base: media("seq/walk/"), count: 121, w: 640, h: 445, fps: 24 };
/** Plays the walk a little faster than real time so it feels lively next to the copy. */
const WALK_SPEED = 1.35;
/** One play-through of the walk, in seconds — the dog crosses the screen exactly once. */
const WALK_SECONDS = WALK.count / (WALK.fps * WALK_SPEED);
const COATS = ["מתולתלת", "חלקה", "קצרה", "מלאה בקשרים"];

/**
 * 01 + 02 — one pinned stage.
 * The dog sits and blinks → stands up as you scroll → walks across the page.
 */
const HeroStory = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const p = useScrollProgress(sectionRef);
  const reduced = useReducedMotion();
  const sit = useFrames(SIT.base, SIT.count);
  const walk = useFrames(WALK.base, WALK.count);

  const idle = useIdleLoop(0, 18, 10, !reduced && p < 0.05);

  // Timeline — the scroll drives the hero and the stand-up; the walk is a one-shot video.
  const heroOut = range(p, 0.04, 0.18);
  const standUp = range(p, 0.05, 0.48);
  const sitOut = range(p, 0.42, 0.5);
  const sitIndex = p < 0.04 ? idle : 18 + standUp * (SIT.count - 19);

  // Crossing into the story starts the walk once; scrolling back above the hero resets it.
  const [storyStarted, setStoryStarted] = useState(false);
  useEffect(() => {
    if (p > 0.5) setStoryStarted(true);
    else if (p < 0.3) setStoryStarted(false);
  }, [p]);
  const t = usePlayOnce(storyStarted && !reduced, WALK_SECONDS);
  const f = reduced ? (storyStarted ? 1 : 0) : t / WALK_SECONDS; // 0 → 1 over the single play-through
  const walkIndex = Math.min(WALK.count - 1, Math.floor(t * WALK.fps * WALK_SPEED));

  // The story copy is revealed in step with the video.
  const show = {
    title: storyStarted,
    lead: f >= 0.12,
    coat: (i: number) => f >= 0.3 + i * 0.12,
    cta: f >= 0.85,
  };

  // RTL "forward" is leftward: the sitting dog stands and walks out to the left, then the
  // walking dog enters from the right, crosses under the story copy once, and is gone.
  // The sitting dog is small inside the sequence frame (it grows as it walks closer), so zoom it in at rest.
  // Side-by-side (copy right, dog left) from tablet width; stacked on phones.
  const isLg = useMediaQuery("(min-width: 768px)");
  const heroTextRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const fit = useMobileDogFit(heroTextRef, storyRef, !isLg);
  const zoom0 = isLg ? 1.4 : 1.3;
  const zoom = zoom0 - standUp * (zoom0 - 1);
  const sitX = (isLg ? -20 : 0) - sitOut * 40;
  const walkX = reduced ? 0 : 65 - f * 130;
  const walkOpacity = storyStarted && !reduced && f > 0 && f < 1 ? 1 : 0;

  return (
    <section ref={sectionRef} id="top" className="relative h-[300vh]" aria-label="פתיחה">
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_55%_at_28%_72%,hsl(var(--accent)/.28),transparent_70%)]" />

        {/* Hero copy */}
        <div
          className="container relative z-10 flex h-full flex-col justify-start pt-24 md:justify-center md:pt-0"
          style={{ opacity: 1 - heroOut, transform: `translateY(${-heroOut * 40}px)`, pointerEvents: heroOut > 0.6 ? "none" : "auto" }}
        >
          <div ref={heroTextRef} className="max-w-xl md:max-w-[50%] lg:max-w-[46%]">
            <p className="eyebrow animate-fade-up">מספרת כלבים בירושלים</p>
            <h1 className="mt-4 animate-fade-up text-[clamp(2.6rem,10.5vw,4.5rem)] font-extrabold text-primary [animation-delay:100ms] md:text-[clamp(2.75rem,5.4vw,5.6rem)]">
              הם באים להתפנק.
              <br />
              <span className="text-accent">אתם</span> באים להתאהב.
            </h1>
            <p className="mt-5 max-w-lg animate-fade-up text-lg text-muted-foreground [animation-delay:200ms] md:text-xl">
              תספורת, רחצה וטיפוח עם תשומת לב לכל פרט — ובעיקר למי שנמצא מתחת לפרווה.
            </p>
            <div className="mt-7 flex animate-fade-up flex-col gap-3 [animation-delay:300ms] sm:flex-row sm:flex-wrap sm:items-center">
              <button onClick={() => scrollToId("booking")} className="btn-primary">קובעים תור</button>
              <button onClick={() => scrollToId("finder")} className="btn-ghost">איזה טיפול מתאים לכלב שלי?</button>
            </div>
          </div>
        </div>

        {/* Story copy — revealed in step with the one-shot walk */}
        <div
          ref={storyRef}
          className="container absolute inset-x-0 top-0 z-10 pt-24 text-center md:pt-28"
          style={{ pointerEvents: show.title ? "auto" : "none" }}
          aria-hidden={!show.title}
        >
          <h2 className={cn("section-title", step(show.title))}>לכל פרווה יש סיפור.</h2>
          <p className={cn("lead mx-auto mt-4 max-w-2xl", step(show.lead))}>
            מתולתלת, חלקה, קצרה או מלאה בקשרים — לכל כלב מתאים טיפול קצת אחר.
          </p>
          <ul className="mt-6 flex flex-wrap justify-center gap-2" aria-label="סוגי פרווה">
            {COATS.map((c, i) => (
              <li
                key={c}
                className={cn(
                  "rounded-full border border-primary/15 bg-card/80 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur",
                  step(show.coat(i)),
                )}
              >
                פרווה {c}
              </li>
            ))}
          </ul>
          <button
            onClick={() => scrollToId("finder")}
            className={cn("btn-ghost mt-7 bg-background/70 backdrop-blur", step(show.cta))}
            tabIndex={show.cta ? 0 : -1}
          >
            בואו נמצא את הטיפול המתאים
          </button>
        </div>

        {/* The dog — sitting → standing → walking out */}
        <div
          className="absolute bottom-[4vh] left-1/2 w-[min(66vw,340px)] will-change-transform md:bottom-[7vh] md:w-[min(38vw,500px)] lg:w-[min(34vw,500px)]"
          style={{ transform: `translate3d(calc(-50% + ${sitX}vw),0,0)`, opacity: 1 - sitOut, width: fit?.sit, bottom: fit?.sitBottom }}
          aria-hidden={sitOut > 0.5}
        >
          <div style={{ transform: `scale(${zoom})`, transformOrigin: "50% 92%" }}>
            <DogCanvas {...sit} index={sitIndex} width={SIT.w} height={SIT.h} label="פודל משמשי יושב, מביט אליכם וממצמץ" />
          </div>
          <GroundShadow className="-mt-5 w-1/2" />
        </div>

        {/* The dog — walking across the page */}
        <div
          className="absolute bottom-[calc(4vh+76px)] left-1/2 w-[min(76vw,380px)] will-change-transform md:bottom-[7vh] md:w-[min(38vw,480px)] lg:w-[min(34vw,480px)]"
          style={{ transform: `translate3d(calc(-50% + ${walkX}vw),0,0)`, opacity: walkOpacity, width: fit?.walk, bottom: fit?.walkBottom }}
          aria-hidden={walkOpacity === 0}
        >
          <DogCanvas {...walk} index={walkIndex} width={WALK.w} height={WALK.h} label="פודל משמשי צועד הלאה" />
          <GroundShadow className="-mt-4 w-2/3" />
        </div>

        <div
          className="absolute bottom-4 right-1/2 hidden translate-x-1/2 flex-col items-center gap-1 text-xs text-muted-foreground transition-opacity md:flex"
          style={{ opacity: 1 - heroOut }}
          aria-hidden
        >
          גוללים, והוא קם ללכת
          <ArrowDown className="h-4 w-4 animate-bounce" />
        </div>
      </div>
    </section>
  );
};

/** Fade-and-rise reveal used for each story element. */
const step = (visible: boolean) =>
  cn("transition-all duration-700 ease-out", visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0");

/**
 * On phones the copy and buttons take most of the screen, so size each dog
 * from the space actually left under its copy — it must never cover a button.
 */
function useMobileDogFit(
  heroText: React.RefObject<HTMLDivElement>,
  story: React.RefObject<HTMLDivElement>,
  enabled: boolean,
) {
  const [fit, setFit] = useState<{ sit: number; walk: number; sitBottom: number; walkBottom: number } | null>(null);
  useEffect(() => {
    if (!enabled) { setFit(null); return; }
    const measure = () => {
      const h = heroText.current, st = story.current;
      if (!h || !st) return;
      const vw = window.innerWidth, vh = window.innerHeight, gap = 28;
      // offsetTop/Height ignore the scroll-driven transforms, so this is the resting layout.
      const heroBottomPx = (h.offsetParent ? (h.offsetParent as HTMLElement).offsetTop : 0) + h.offsetTop + h.offsetHeight;
      const baseBottom = vh * 0.04;
      // Visible dog height as a share of canvas width, measured from the frames:
      // sitting (incl. the rest zoom) ≈ 0.95 × width, walking ≈ 0.7 × width.
      const SIT_H = 0.95, WALK_H = 0.7;
      const sitTop = heroBottomPx + gap;
      const walkTop = st.offsetTop + st.offsetHeight + gap;
      const sit = Math.max(170, Math.min(vw * 0.66, 340, (vh - sitTop - baseBottom) / SIT_H));
      const walk = Math.max(170, Math.min(vw * 0.76, 380, (vh - walkTop - baseBottom - 76) / WALK_H));
      // Anchor the head just under the copy; when space runs out the paws run off the
      // bottom edge instead of the dog climbing over the buttons.
      setFit({
        sit,
        walk,
        sitBottom: Math.min(baseBottom, vh - sitTop - sit * SIT_H),
        walkBottom: Math.min(baseBottom + 76, vh - walkTop - walk * WALK_H),
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (heroText.current) ro.observe(heroText.current);
    if (story.current) ro.observe(story.current);
    window.addEventListener("resize", measure);
    return () => { ro.disconnect(); window.removeEventListener("resize", measure); };
  }, [enabled, heroText, story]);
  return fit;
}

export default HeroStory;
