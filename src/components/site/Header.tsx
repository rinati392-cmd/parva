import { useEffect, useState } from "react";
import { cn, media, scrollToId } from "@/lib/utils";

const NAV = [
  { id: "finder", label: "איזה טיפול?" },
  { id: "treatments", label: "הטיפולים" },
  { id: "approach", label: "איך אנחנו עובדים" },
  { id: "faq", label: "שאלות" },
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "bg-background/85 shadow-[0_1px_0_hsl(var(--border))] backdrop-blur-md" : "bg-transparent",
      )}
    >
      <div className="container flex h-16 items-center justify-between gap-4 md:h-20">
        <a href="#top" aria-label="פרווה טובה — לראש העמוד" className="shrink-0">
          <img src={media("logo.svg")} alt="פרווה טובה" className="h-9 w-auto md:h-11" width={172} height={56} />
        </a>
        <nav aria-label="ניווט ראשי" className="hidden lg:block">
          <ul className="flex items-center gap-8 text-[15px] font-medium text-foreground/80">
            {NAV.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`} className="transition-colors hover:text-primary">{n.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <button onClick={() => scrollToId("booking")} className="btn-primary h-11 px-5 text-base md:h-12 md:px-6">
          קובעים תור
        </button>
      </div>
    </header>
  );
};

export default Header;
