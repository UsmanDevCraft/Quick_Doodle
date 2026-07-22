import React from "react";
import TiltCard from "./TiltCard";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

const GlowyCard = ({
  icon,
  title,
  description,
  gradient,
  glowColor,
  onClick,
  disabled,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  glowColor: string;
  onClick?: () => void;
  disabled?: boolean;
}) => {
  return (
    <TiltCard
      onClick={disabled ? undefined : onClick}
      glowColor={glowColor}
      className={`h-full ${disabled ? "opacity-50 pointer-events-none" : ""}`}
    >
      <div
        className={`
          h-full p-6 rounded-2xl relative overflow-hidden group/card
          bg-gradient-to-br ${gradient}
          border border-white/10
          transition-all duration-500
          hover:border-white/30
          hover:shadow-[0_0_60px_-12px_${glowColor.replace("0.4", "0.3")}]
        `}
      >
        {/* Animated gradient background on hover */}
        <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
        </div>

        {/* Glow orb */}
        <div
          className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20 group-hover/card:opacity-40 transition-opacity duration-500 blur-2xl pointer-events-none"
          style={{ background: glowColor.replace("0.4", "0.6") }}
        />

        <div className="relative z-10 flex flex-col h-full">
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="w-14 h-14 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-4 border border-white/20 group-hover/card:border-white/40 transition-colors shrink-0"
          >
            {icon}
          </motion.div>
          <h3 className="text-xl font-bold mb-2 group-hover/card:text-white transition-colors">
            {title}
          </h3>
          <p className="text-sm text-white/60 leading-relaxed group-hover/card:text-white/80 transition-colors flex-grow">
            {description}
          </p>

          {/* Fixed: Triggers when the full card is hovered */}
          <div className="mt-4 flex items-center gap-2 text-sm font-medium text-white/70 group-hover/card:text-white transition-all duration-300 -translate-x-2 opacity-0 group-hover/card:translate-x-0 group-hover/card:opacity-100">
            <span>Play Now</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </TiltCard>
  );
};

export default GlowyCard;
