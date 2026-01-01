import React from "react";
import { ButtonProps } from "@/types/app/Button/button";

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  variant = "primary",
  icon,
  className = "",
  isOnlyClassName = false,
  disabled = false,
}) => {
  const baseStyles =
    "w-full sm:w-80 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform flex items-center justify-center gap-3 backdrop-blur-sm";

  const variants = {
    primary:
      "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-purple-500/50",
    secondary:
      "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/50",
    accent:
      "bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-lg shadow-orange-500/50",
  };

  const interactionStyles = disabled
    ? "opacity-40 cursor-not-allowed grayscale"
    : "hover:scale-105 hover:shadow-2xl active:scale-95";

  const combinedClassName = isOnlyClassName
    ? className
    : `${baseStyles} ${variants[variant]} ${interactionStyles} ${className}`;

  return (
    <button
      disabled={disabled}
      onClick={() => {
        if (disabled) return;
        onClick?.();
      }}
      className={combinedClassName}
    >
      {icon && <span className="text-2xl">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

export default Button;
