export default function Loader() {
  const letters = ["G", "A", "M", "E", " ", "A", "R", "E", "N", "A"];

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[8px] flex flex-col items-center justify-center">
        <div className="flex gap-1 text-6xl md:text-8xl font-black tracking-[0.5rem]">
          {letters.map((letter, index) => (
            <span
              key={index}
              className="inline-block animate-colorChange"
              style={{
                animationDelay: `${index * 0.1}s`,
                color: "#4a4a4a",
              }}
            >
              {letter === " " ? "\u00A0" : letter}
            </span>
          ))}
        </div>

        <div className="flex gap-2 mt-16">
          <div
            className="w-3 h-3 bg-white rounded-full animate-bounce"
            style={{ animationDelay: "-0.32s" }}
          ></div>
          <div
            className="w-3 h-3 bg-white rounded-full animate-bounce"
            style={{ animationDelay: "-0.16s" }}
          ></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
        </div>
      </div>
      <style jsx>{`
        @keyframes colorChange {
          0%,
          100% {
            color: #4a4a4a;
          }
          50% {
            color: white;
          }
        }

        .animate-colorChange {
          animation: colorChange 1s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
