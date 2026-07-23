import React, { useRef } from "react";
import { motion, useTransform, useMotionValue } from "motion/react";

const TiltCard = ({
  children,
  className = "",
  onClick,
  glowColor = "rgba(139, 92, 246, 0.4)",
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  glowColor?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(x, [-0.5, 0.5], ["-8deg", "8deg"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();

    // Check if mouse is strictly inside the card boundaries
    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    ) {
      handleMouseLeave();
      return;
    }

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) / rect.width);
    y.set((e.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative cursor-pointer group will-change-transform ${className}`}
    >
      {/* Background glow restrained inside pointer boundary */}
      <div
        style={{
          background: `radial-gradient(circle at center, ${glowColor}, transparent 70%)`,
        }}
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none"
      />
      <div className="relative h-full z-10">{children}</div>
    </motion.div>
  );
};

export default TiltCard;
