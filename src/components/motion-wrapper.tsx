"use client";

import { useEffect, type ReactNode } from "react";
import { useAnimate } from "motion/react-mini";
import { useInView, useReducedMotion } from "motion/react";

export function MotionWrapper({ children, className = "" }: { children: ReactNode; className?: string }) {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const reduced = useReducedMotion();
  const visible = useInView(scope, { once: true, margin: "0px 0px -40px 0px" });

  useEffect(() => {
    if (!visible || reduced) return;
    const tokens = getComputedStyle(document.documentElement);
    const distance = Number(tokens.getPropertyValue("--entrance-distance"));
    const duration = Number(tokens.getPropertyValue("--entrance-duration")) / 1000;
    const controls = animate(scope.current, { y: [distance, 0], opacity: [0.85, 1] }, { duration, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [animate, reduced, scope, visible]);

  return (
    <div ref={scope} className={className}>{children}</div>
  );
}
