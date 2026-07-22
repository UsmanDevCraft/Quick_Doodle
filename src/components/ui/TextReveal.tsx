import React from "react";
import { motion } from "motion/react";

const TextReveal = ({
  text,
  className = "",
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) => {
  const letters = text.split("");

  return (
    <motion.span
      initial="hidden"
      animate="visible"
      className={`inline-block ${className}`}
      aria-label={text}
    >
      {letters.map((letter, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0, y: 30, rotateX: -60 },
            visible: {
              opacity: 1,
              y: 0,
              rotateX: 0,
              transition: {
                delay: delay + i * 0.04,
                duration: 0.4,
                type: "spring",
                stiffness: 300,
                damping: 24,
              },
            },
          }}
          className="inline-block"
          style={{ transformOrigin: "bottom center" }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.span>
  );
};

export default TextReveal;
