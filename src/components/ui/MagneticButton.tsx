import React, { useRef } from "react";
import { motion, useSpring, useMotionValue } from "motion/react";

const MagneticButton = ({
  children,
  onClick,
  className,
  disabled = false,
  variant = "primary",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "accent" | "gradient";
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (disabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.15);
    y.set((e.clientY - centerY) * 0.15);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const variantStyles = {
    primary: {
      bg: "bg-gradient-to-r from-blue-500 to-purple-600",
      hoverBg: "hover:from-blue-400 hover:to-purple-500",
      glow: "shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_40px_rgba(59,130,246,0.5)]",
      border: "border-blue-400/20",
    },
    secondary: {
      bg: "bg-white/10",
      hoverBg: "hover:bg-white/20",
      glow: "shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]",
      border: "border-white/20",
    },
    accent: {
      bg: "bg-gradient-to-r from-emerald-400 to-cyan-500",
      hoverBg: "hover:from-emerald-300 hover:to-cyan-400",
      glow: "shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)]",
      border: "border-emerald-400/20",
    },
    gradient: {
      bg: "bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600",
      hoverBg: "hover:from-orange-400 hover:via-pink-400 hover:to-purple-500",
      glow: "shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:shadow-[0_0_40px_rgba(236,72,153,0.5)]",
      border: "border-pink-400/20",
    },
  };

  const style = variantStyles[variant];

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      disabled={disabled}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        relative px-8 py-4 rounded-2xl font-bold text-white
        backdrop-blur-sm transition-all duration-300
        border ${style.border}
        ${style.bg} ${style.hoverBg}
        ${style.glow}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
    >
      {/* Inner glow overlay on hover */}
      <div className="absolute inset-0 rounded-2xl bg-white/0 hover:bg-white/10 transition-colors duration-300" />
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
};

export default MagneticButton;
