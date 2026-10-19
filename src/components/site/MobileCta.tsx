import { useEffect, useState } from "react";
import { cn, scrollToId } from "@/lib/utils";

/** Persistent primary action on phones — hidden on the hero and once the form is on screen. */
const MobileCta = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => {
      const booking = document.getElementById("booking");
      const nearBooking = booking ? booking.getBoundingClientRect().top < window.innerHeight * 0.8 : false;
      setShow(window.scrollY > window.innerHeight * 0.7 && !nearBooking);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t bg-background/90 p-3 pb-[max(.75rem,env(safe-area-inset-bottom))] backdrop-blur-md transition-transform duration-500 md:hidden",
        show ? "translate-y-0" : "translate-y-full",
      )}
      aria-hidden={!show}
    >
      <button onClick={() => scrollToId("booking")} className="btn-primary w-full" tabIndex={show ? 0 : -1}>
        קובעים תור
      </button>
    </div>
  );
};

export default MobileCta;
