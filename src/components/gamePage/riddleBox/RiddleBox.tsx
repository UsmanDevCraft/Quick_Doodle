import Button from "@/components/Button/Button";
import { RiddleBoxProps } from "@/types/app/Game/game";
import React from "react";

const RiddleBox: React.FC<RiddleBoxProps> = ({
  guess,
  setGuess,
  handleGuessSubmit,
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-white/20 rounded-xl p-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Type your guess..."
          className="flex-1 bg-white/10 border border-white/20 rounded-lg px-6 py-4 text-white text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <Button
          onClick={handleGuessSubmit}
          variant="accent"
          className="sm:w-auto w-full text-lg py-4"
          disabled={!guess.trim()}
        >
          Submit Guess
        </Button>
      </div>
    </div>
  );
};

export default RiddleBox;
