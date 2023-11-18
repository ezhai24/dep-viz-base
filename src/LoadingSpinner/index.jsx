import { motion, useAnimate } from "framer-motion";
import { React, useEffect } from "react";

export default function LoadingSpinner() {
  const text = "LOADING LOADING LOADING";
  const characters = text.split("");

  const radius = 40;
  const fontSize = "12px";
  const letterSpacing = 15;

  const [scope, animate] = useAnimate();

  useEffect(() => {
    const animateLoader = async () => {
      const letterAnimation = [];
      characters.forEach((_, i) => {
        letterAnimation.push([
          `.letter-${i}`,
          { opacity: 0 },
          { duration: 0.3, at: i === 0 ? "+0.8" : "-0.28" },
        ]);
      });
      characters.forEach((_, i) => {
        letterAnimation.push([
          `.letter-${i}`,
          { opacity: 1 },
          { duration: 0.3, at: i === 0 ? "+0.8" : "-0.28" },
        ]);
      });
      animate(letterAnimation, {
        ease: "linear",
        repeat: Infinity,
      });
      animate(
        scope.current,
        { rotate: 360 },
        { duration: 4, ease: "linear", repeat: Infinity },
      );
    };
    animateLoader();
  }, []);

  return (
    <motion.div
      ref={scope}
      className="relative aspect-square"
      style={{ width: radius * 2 }}
    >
      <p aria-label={text} />
      <p aria-hidden="true">
        {characters.map((ch, i) => (
          <motion.span
            key={i}
            className="absolute left-[50%] top-0"
            style={{
              transformOrigin: `0 ${radius}px`,
              transform: `rotate(${i * letterSpacing}deg)`,
              fontSize,
            }}
          >
            {ch}
          </motion.span>
        ))}
      </p>
    </motion.div>
  );
}
