import type { ElementType, ReactNode } from "react";
import { useInView } from "@/hooks/use-motion";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: ElementType;
}

const Reveal = ({ children, className, delay = 0, as: Tag = "div" }: RevealProps) => {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
  return (
    <Tag ref={ref} className={cn("reveal", inView && "is-in", className)} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </Tag>
  );
};

export default Reveal;
