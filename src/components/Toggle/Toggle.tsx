import { useState } from "react";
import Button from "../Button/Button";

export default function Toggle() {
  const [activeMode, setActiveMode] = useState<"riddle" | "draw">("riddle");

  return (
    <div className="w-full flex items-center justify-center p-4">
      <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-2 flex gap-2">
        <div
          className={`absolute top-2 bottom-2 w-[calc(50%-0.5rem)] bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300 ease-in-out ${
            activeMode === "riddle" ? "left-2" : "left-[calc(50%+0.25rem)]"
          }`}
        />

        <Button
          onClick={() => setActiveMode("riddle")}
          isOnlyClassName={true}
          className={`relative z-10 px-8 py-3 rounded-full font-semibold text-lg transition-all duration-300 w-auto cursor-pointer ${
            activeMode === "riddle"
              ? "text-white"
              : "text-gray-400 hover:text-gray-200"
          }`}
          icon="🧩"
        >
          Riddle
        </Button>

        <Button
          onClick={() => setActiveMode("draw")}
          isOnlyClassName={true}
          className={`relative z-10 px-8 py-3 rounded-full font-semibold text-lg transition-all duration-300 w-auto cursor-pointer ${
            activeMode === "draw"
              ? "text-white"
              : "text-gray-400 hover:text-gray-200"
          }`}
          icon="🎨"
        >
          Draw
        </Button>
      </div>
    </div>
  );
}
