const Footer = () => (
  <footer className="relative bg-primary pb-28 pt-14 text-primary-foreground md:pb-14">
    <img
      src="/media/dog/walk.webp"
      alt=""
      aria-hidden
      className="pointer-events-none absolute -top-[88px] left-[8%] h-24 w-auto object-contain md:-top-[118px] md:h-32"
      loading="lazy"
    />
    <div className="container flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
      <div className="flex items-center gap-4">
        <img src="/media/logo.svg" alt="" className="h-12 w-auto brightness-0 invert" width={172} height={56} />
        <div>
          <p className="text-xl font-bold">פרווה טובה</p>
          <p className="text-primary-foreground/70">מספרת כלבים בירושלים</p>
        </div>
      </div>
      <nav aria-label="ניווט תחתון">
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-primary-foreground/80">
          <li><a href="#treatments" className="hover:text-accent">הטיפולים</a></li>
          <li><a href="#approach" className="hover:text-accent">איך אנחנו עובדים</a></li>
          <li><a href="#faq" className="hover:text-accent">שאלות</a></li>
          <li><a href="#booking" className="hover:text-accent">קובעים תור</a></li>
        </ul>
      </nav>
    </div>
    <p className="container mt-10 text-sm text-primary-foreground/50">© {new Date().getFullYear()} פרווה טובה</p>
  </footer>
);

export default Footer;
