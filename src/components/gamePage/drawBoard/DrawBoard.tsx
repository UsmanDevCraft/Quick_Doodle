import React, { useEffect, useRef, useState } from "react";
import { Point, Stroke, DrawBoardProps } from "../../../types/app/Game/game";

const uid = () => Math.random().toString(36).slice(2, 9);

export default function DrawBoard({
  height = 480,
  initialTheme = "light",
  penWidth = 4,
  eraserWidth = 20,
  socket,
  roomId,
  isRiddler,
}: DrawBoardProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [theme, setTheme] = useState(initialTheme);
  const [mode, setMode] = useState<"draw" | "erase">("draw");
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const currentStrokeRef = useRef<Stroke | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctxRef.current = ctx;

    const handleResize = () => {
      const container = containerRef.current!;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.floor(rect.width * ratio));
      canvas.height = Math.max(1, Math.floor((height || rect.height) * ratio));
      canvas.style.width = `${Math.floor(rect.width)}px`;
      canvas.style.height = `${Math.floor(height || rect.height)}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      redrawAll();
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height]);

  // Socket listeners
  useEffect(() => {
    if (!socket) return;

    const handler = (incoming: any) => {
      const payload = incoming.data ?? incoming; // support { data: ... } or { action: ... }

      // === HANDLE UNDO / CLEAR ===
      if (payload.action === "undo") {
        setStrokes((prev) => (prev.length > 0 ? prev.slice(0, -1) : prev));
        return;
      }
      if (payload.action === "clear") {
        setStrokes([]);
        const ctx = ctxRef.current;
        const canvas = canvasRef.current;
        if (ctx && canvas) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          redrawAll();
        }
        return;
      }

      // === HANDLE STROKE ===
      const stroke: Stroke = payload;
      if (!stroke?.points) return;

      setStrokes((prev) => {
        if (prev.some((s) => s.id === stroke.id)) return prev;
        drawStroke(stroke);
        return [...prev, stroke];
      });
    };

    socket.on("drawing", handler);
    return () => socket.off("drawing", handler);
  }, [socket, roomId]);

  // Utility: convert client coords to normalized coords
  function toNormalized(x: number, y: number) {
    const c = canvasRef.current!;
    const rect = c.getBoundingClientRect();
    return { x: (x - rect.left) / rect.width, y: (y - rect.top) / rect.height };
  }

  function fromNormalized(p: Point) {
    const c = canvasRef.current!;
    const rect = c.getBoundingClientRect();
    return { x: p.x * rect.width, y: p.y * rect.height };
  }

  // Begin a stroke
  function startStroke(clientX: number, clientY: number) {
    const norm = toNormalized(clientX, clientY);
    const stroke: Stroke = {
      id: uid(),
      color: theme === "light" ? "#000000" : "#FFFFFF",
      width: mode === "draw" ? penWidth : eraserWidth,
      mode,
      points: [norm],
    };
    currentStrokeRef.current = stroke;
    setIsDrawing(true);
  }

  function pushPoint(clientX: number, clientY: number) {
    const cur = currentStrokeRef.current;
    if (!cur) return;
    const norm = toNormalized(clientX, clientY);
    cur.points.push(norm);
    drawLatestSegment(cur);
  }

  function endStroke() {
    const cur = currentStrokeRef.current;
    if (!cur) return;
    setStrokes((prev) => [...prev, cur]);
    if (socket) {
      socket.emit("drawing", { roomId, data: cur });
    }
    currentStrokeRef.current = null;
    setIsDrawing(false);
  }

  // Drawing primitives
  function drawStroke(stroke: Stroke) {
    const ctx = ctxRef.current!;
    if (!ctx) return;
    const pts = stroke.points.map(fromNormalized);
    if (pts.length === 0) return;
    ctx.save();
    if (stroke.mode === "erase") {
      ctx.globalCompositeOperation = "destination-out";
    } else {
      ctx.globalCompositeOperation = "source-over";
    }
    ctx.lineWidth = stroke.width;
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) {
      ctx.lineTo(pts[i].x, pts[i].y);
    }
    // Use current theme color instead of saved color for dynamic theme switching
    ctx.strokeStyle = theme === "light" ? "#000000" : "#FFFFFF";
    ctx.stroke();
    ctx.restore();
  }

  function drawLatestSegment(stroke: Stroke) {
    const ctx = ctxRef.current!;
    const len = stroke.points.length;
    if (len < 2) return drawStroke({ ...stroke, points: [stroke.points[0]] });
    const lastTwo = [stroke.points[len - 2], stroke.points[len - 1]].map(
      fromNormalized
    );
    ctx.save();
    if (stroke.mode === "erase")
      ctx.globalCompositeOperation = "destination-out";
    else ctx.globalCompositeOperation = "source-over";
    ctx.lineWidth = stroke.width;
    ctx.beginPath();
    ctx.moveTo(lastTwo[0].x, lastTwo[0].y);
    ctx.lineTo(lastTwo[1].x, lastTwo[1].y);
    // Use current theme color
    ctx.strokeStyle = theme === "light" ? "#000000" : "#FFFFFF";
    ctx.stroke();
    ctx.restore();
  }

  function redrawAll() {
    const canvas = canvasRef.current!;
    const ctx = ctxRef.current!;
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (theme === "light") {
      ctx.save();
      ctx.globalCompositeOperation = "destination-over";
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    } else {
      ctx.save();
      ctx.globalCompositeOperation = "destination-over";
      ctx.fillStyle = "#0b1220";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    }

    for (const s of strokes) drawStroke(s);
  }

  // UI events
  useEffect(() => {
    redrawAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strokes, theme]);

  // Pointer handlers
  useEffect(() => {
    const canvas = canvasRef.current!;
    if (!canvas) return;

    const handlePointerDown = (e: PointerEvent) => {
      (e.target as Element).setPointerCapture(e.pointerId);
      startStroke(e.clientX, e.clientY);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDrawing) return;
      pushPoint(e.clientX, e.clientY);
    };

    const handlePointerUp = (e: PointerEvent) => {
      try {
        (e.target as Element).releasePointerCapture(e.pointerId);
      } catch (e) {
        console.log("Pointer release error:", e);
      }
      if (!isDrawing) return;
      endStroke();
    };

    canvas.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      canvas.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDrawing, mode, penWidth, eraserWidth, theme]);

  function undo() {
    setStrokes((prev) => prev.slice(0, -1));
    socket?.emit("drawing", { roomId, action: "undo" });
  }

  function clearBoard() {
    setStrokes([]);
    if (socket) {
      socket.emit("drawing", { roomId, action: "clear" });
    }
    const ctx = ctxRef.current!;
    if (ctx) {
      const canvas = canvasRef.current!;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      redrawAll();
    }
  }

  function toggleTheme() {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  }

  return (
    <div className="w-full" ref={containerRef}>
      {/* Control Buttons */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {isRiddler && (
          <>
            {/* Pen Button */}
            <button
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 cursor-pointer ${
                mode === "draw"
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                  : "bg-white/10 text-gray-300 border border-white/20 hover:bg-white/20"
              }`}
              onClick={() => setMode("draw")}
            >
              ✏️ Pen
            </button>

            {/* Eraser Button */}
            <button
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 cursor-pointer ${
                mode === "erase"
                  ? "bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-lg"
                  : "bg-white/10 text-gray-300 border border-white/20 hover:bg-white/20"
              }`}
              onClick={() => setMode("erase")}
            >
              🧹 Eraser
            </button>

            {/* Undo Button */}
            <button
              className="px-4 py-2 rounded-lg font-semibold bg-white/10 text-gray-300 border border-white/20 hover:bg-white/20 transition-all duration-200 cursor-pointer"
              onClick={undo}
            >
              ↶ Undo
            </button>

            {/* Clear Button */}
            <button
              className="px-4 py-2 rounded-lg font-semibold bg-white/10 text-gray-300 border border-white/20 hover:bg-white/20 transition-all duration-200 cursor-pointer"
              onClick={clearBoard}
            >
              🗑️ Clear
            </button>
          </>
        )}

        {/* Theme Toggle */}
        <button
          className="px-4 py-2 rounded-lg font-semibold bg-white/10 text-gray-300 border border-white/20 hover:bg-white/20 transition-all duration-200 ml-auto cursor-pointer"
          onClick={toggleTheme}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </div>

      {/* Canvas Container */}
      <div
        style={{ height }}
        className={`rounded-lg border-2 overflow-hidden relative shadow-2xl ${
          theme === "light"
            ? "bg-white border-gray-300"
            : "bg-[#0b1220] border-white/20"
        }`}
      >
        <canvas
          ref={canvasRef}
          style={{ touchAction: "none", display: "block" }}
          className="w-full h-full"
        />
      </div>
    </div>
  );
}
