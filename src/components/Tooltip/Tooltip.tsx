"use client";

import React from "react";
import { TooltipProps } from "@/types/app/Tooltip/tooltip";

const Tooltip: React.FC<TooltipProps> = ({ message, children, disabled }) => {
  return (
    <div className="relative group inline-block">
      {children}
      {!disabled && (
        <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs py-1 px-2 rounded-lg whitespace-nowrap transition-opacity duration-200 shadow-lg">
          {message}
        </span>
      )}
    </div>
  );
};

export default Tooltip;
