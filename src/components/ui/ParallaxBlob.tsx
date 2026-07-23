import React from "react";
import { motion, useTransform, useScroll } from "motion/react";
import { useRef } from "react";

const ParallaxBlob = ({
  color,
  size,
  top,
  left,
  delay = 0,
}: {
  color: string;
  size: number;
  top: string;
  left: string;
  delay?: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 1]);

  return (
    <motion.div
      ref={ref}
      style={{ y, scale, width: size, height: size, top, left }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 0.15, scale: 1 }}
      transition={{ duration: 2, delay, ease: "easeOut" }}
      className={`absolute rounded-full mix-blend-screen filter blur-3xl pointer-events-none ${color}`}
    />
  );
};

export default ParallaxBlob;
