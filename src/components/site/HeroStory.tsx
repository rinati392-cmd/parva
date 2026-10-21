import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import DogCanvas from "./DogCanvas";
import GroundShadow from "./GroundShadow";
import { useClock, useFrames, useIdleLoop } from "@/hooks/use-frames";
import { range, useMediaQuery, useReducedMotion, useScrollProgress } from "@/hooks/use-motion";
import { cn, media, scrollToId } from "@/lib/utils";

const SIT = { base: media("seq/sit/"), count: 97, w: 560, h: 538 };
const WALK = { base: media("seq/walk/"), count: 121, w: 640, h: 445, fps: 24 };
/** Plays the walk a little faster than real time so it feels lively next to the copy. */
const WALK_SPEED = 1.35;
/** Seconds the walking dog takes to cross the whole screen, entering right and leaving left. */
const CROSS_SECONDS = 6;
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

  // Timeline
  const heroOut = range(p, 0.05, 0.2);
  const standUp = range(p, 0.06, 0.44);
  const sitOut = range(p, 0.36, 0.44);
  const storyIn = range(p, 0.46, 0.56);
  const walkOn = p > 0.43 ? 1 : 0;

  const sitIndex = p < 0.05 ? idle : 18 + standUp * (SIT.count - 19);
  // The walk plays like a video — on its own clock, not tied to the scroll position.
  const t = useClock(walkOn === 1 && p < 0.999, WALK.fps * WALK_SPEED) * WALK_SPEED;
  const walkIndex = Math.floor(t * WALK.fps) % WALK.count;
  const coatsShown = Math.floor(range(p, 0.55, 0.85) * COATS.length + 0.001);

  // RTL "forward" is leftward: the sitting dog stands and walks out to the left,
  // then the walking dog keeps crossing under the story copy, right to left, on a loop.
  // The sitting dog is small inside the sequence frame (it grows as it walks closer), so zoom it in at rest.
  const isLg = useMediaQuery("(min-width: 1024px)");
  const heroTextRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const fit = useMobileDogFit(heroTextRef, storyRef, !isLg);
  const zoom0 = isLg ? 1.4 : 1.3;
  const zoom = zoom0 - standUp * (zoom0 - 1);
  const sitX = (isLg ? -20 : 0) - sitOut * 40;
  const walkX = reduced ? 0 : 65 - ((t % CROSS_SECONDS) / CROSS_SECONDS) * 130;

  return (
    <section ref={sectionRef} id="top" className="relative h-[420vh]" aria-label="פתיחה">
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_55%_at_28%_72%,hsl(var(--accent)/.28),transparent_70%)]" />

        {/* Hero copy */}
        <div
          className="container relative z-10 flex h-full flex-col justify-start pt-24 md:pt-32 lg:justify-center lg:pt-0"
          style={{ opacity: 1 - heroOut, transform: `translateY(${-heroOut * 40}px)`, pointerEvents: heroOut > 0.6 ? "none" : "auto" }}
        >
          <div ref={heroTextRef} className="max-w-xl lg:max-w-[46%]">
            <p className="eyebrow animate-fade-up">מספרת כלבים בירושלים</p>
            <h1 className="mt-4 animate-fade-up text-[clamp(2.6rem,10.5vw,4.5rem)] font-extrabold text-primary [animation-delay:100ms] lg:text-[clamp(3.5rem,5.4vw,5.6rem)]">
              הם באים להתפנק.
              <br />
              <span className="text-accent">אתם</span> באים להתאהב.
            </h1>
            <p className="mt-5 max-w-lg animate-fade-up text-lg text-muted-foreground [animation-delay:200ms] md:text-xl">
              תספורת, רחצה וטיפוח עם תשומת לב לכל פרט — ובעיקר למי שנמצא מתחת לפרווה.
            </p>
            <div className="mt-7 flex animate-fade-up flex-col gap-3 [animation-delay:300ms] sm:flex-row sm:items-center">
              <button onClick={() => scrollToId("booking")} className="btn-primary">קובעים תור</button>
              <button onClick={() => scrollToId("finder")} className="btn-ghost">איזה טיפול מתאים לכלב שלי?</button>
            </div>
          </div>
        </div>

        {/* Story copy */}
        <div
          ref={storyRef}
          className="container absolute inset-x-0 top-0 z-10 pt-24 text-center md:pt-28"
          style={{ opacity: storyIn, transform: `translateY(${(1 - storyIn) * 30}px)`, pointerEvents: storyIn > 0.5 ? "auto" : "none" }}
          aria-hidden={storyIn < 0.5}
        >
          <h2 className="section-title">לכל פרווה יש סיפור.</h2>
          <p className="lead mx-auto mt-4 max-w-2xl">מתולתלת, חלקה, קצרה או מלאה בקשרים — לכל כלב מתאים טיפול קצת אחר.</p>
          <ul className="mt-6 flex flex-wrap justify-center gap-2" aria-label="סוגי פרווה">
            {COATS.map((c, i) => (
              <li
                key={c}
                className={cn(
                  "rounded-full border border-primary/15 bg-card/80 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur transition-all duration-500",
                  i < coatsShown ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
                )}
              >
                פרווה {c}
              </li>
            ))}
          </ul>
          <button
            onClick={() => scrollToId("finder")}
            className={cn("btn-ghost mt-7 bg-background/70 backdrop-blur transition-opacity duration-500", p > 0.8 ? "opacity-100" : "opacity-0")}
            tabIndex={p > 0.8 ? 0 : -1}
          >
            בואו נמצא את הטיפול המתאים
          </button>
        </div>

        {/* The dog — sitting → standing → walking out */}
        <div
          className="absolute bottom-[4vh] left-1/2 w-[min(66vw,340px)] will-change-transform lg:bottom-[7vh] lg:w-[min(34vw,500px)]"
          style={{ transform: `translate3d(calc(-50% + ${sitX}vw),0,0)`, opacity: 1 - sitOut, width: fit?.sit }}
          aria-hidden={sitOut > 0.5}
        >
          <div style={{ transform: `scale(${zoom})`, transformOrigin: "50% 92%" }}>
            <DogCanvas {...sit} index={sitIndex} width={SIT.w} height={SIT.h} label="פודל משמשי יושב, מביט אליכם וממצמץ" />
          </div>
          <GroundShadow className="-mt-5 w-1/2" />
        </div>

        {/* The dog — walking across the page */}
        <div
          className="absolute bottom-[calc(4vh+76px)] left-1/2 md:bottom-[4vh] w-[min(76vw,380px)] will-change-transform lg:bottom-[7vh] lg:w-[min(34vw,480px)]"
          style={{ transform: `translate3d(calc(-50% + ${walkX}vw),0,0)`, opacity: walkOn, width: fit?.walk }}
          aria-hidden={!walkOn}
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

/**
 * On phones the copy and buttons take most of the screen, so size each dog
 * from the space actually left under its copy — it must never cover a button.
 */
function useMobileDogFit(
  heroText: React.RefObject<HTMLDivElement>,
  story: React.RefObject<HTMLDivElement>,
  enabled: boolean,
) {
  const [fit, setFit] = useState<{ sit: number; walk: number } | null>(null);
  useEffect(() => {
    if (!enabled) { setFit(null); return; }
    const measure = () => {
      const h = heroText.current, st = story.current;
      if (!h || !st) return;
      const vw = window.innerWidth, vh = window.innerHeight, gap = 28;
      // offsetTop/Height ignore the scroll-driven transforms, so this is the resting layout.
      const heroBottomPx = (h.offsetParent ? (h.offsetParent as HTMLElement).offsetTop : 0) + h.offsetTop + h.offsetHeight;
      const sitRoom = vh - heroBottomPx - gap - vh * 0.04;
      const walkRoom = vh - (st.offsetTop + st.offsetHeight) - gap - (vh * 0.04 + 76);
      // Visible dog height ≈ 0.84 × canvas width (sitting, zoomed) and 0.7 × width (walking).
      setFit({
        sit: Math.max(120, Math.min(vw * 0.66, 340, sitRoom / 0.84)),
        walk: Math.max(140, Math.min(vw * 0.76, 380, walkRoom / 0.7)),
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
