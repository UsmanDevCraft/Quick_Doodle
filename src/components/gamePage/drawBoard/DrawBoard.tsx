import React, { useEffect, useRef, useState } from "react";

export type Point = { x: number; y: number };
export type Stroke = {
  id: string;
  color: string;
  width: number;
  mode: "draw" | "erase";
  points: Point[];
};

type Props = {
  width?: number | "100%";
  height?: number;
  initialTheme?: "light" | "dark";
  penWidth?: number;
  eraserWidth?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  socket?: any;
  socketEventName?: string;
  roomId?: string;
};

const uid = () => Math.random().toString(36).slice(2, 9);

export default function DrawBoard({
  height = 480,
  initialTheme = "light",
  penWidth = 4,
  eraserWidth = 20,
  socket,
  socketEventName = "stroke",
  roomId,
}: Props) {
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
    const handler = (payload: Stroke & { roomId?: string }) => {
      if (roomId && payload.roomId && payload.roomId !== roomId) return;
      setStrokes((prev) => {
        if (prev.find((s) => s.id === payload.id)) return prev;
        const s: Stroke = {
          id: payload.id,
          color: payload.color,
          width: payload.width,
          mode: payload.mode,
          points: payload.points,
        };
        drawStroke(s);
        return [...prev, s];
      });
    };

    socket.on(socketEventName, handler);
    return () => {
      socket.off(socketEventName, handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, socketEventName, roomId]);

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
      const payload = { ...cur, roomId };
      socket.emit(socketEventName, payload);
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
      // real eraser
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
    ctx.strokeStyle = stroke.color;
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
    ctx.strokeStyle = stroke.color;
    ctx.stroke();
    ctx.restore();
  }

  function redrawAll() {
    const canvas = canvasRef.current!;
    const ctx = ctxRef.current!;
    if (!canvas || !ctx) return;
    // clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // draw background according to theme
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

    // draw each stroke
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

  // Controls: undo, clear, theme toggle, mode toggle
  function undo() {
    setStrokes((prev) => {
      const next = prev.slice(0, -1);
      return next;
    });
  }

  function clearBoard() {
    setStrokes([]);
    const ctx = ctxRef.current!;
    if (!ctx) return;
    const canvas = canvasRef.current!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    redrawAll();
  }

  function toggleTheme() {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  }

  return (
    <div className="w-full" ref={containerRef}>
      <div className="flex items-center gap-2 mb-2">
        <button
          className="px-3 py-1 rounded-lg border"
          onClick={() => setMode("draw")}
          aria-pressed={mode === "draw"}
        >
          Pen
        </button>
        <button
          className="px-3 py-1 rounded-lg border"
          onClick={() => setMode("erase")}
          aria-pressed={mode === "erase"}
        >
          Eraser
        </button>
        <button className="px-3 py-1 rounded-lg border" onClick={undo}>
          Undo
        </button>
        <button className="px-3 py-1 rounded-lg border" onClick={clearBoard}>
          Clear
        </button>
        <button
          className="px-3 py-1 rounded-lg border ml-auto"
          onClick={toggleTheme}
        >
          Theme: {theme}
        </button>
        <div className="ml-2 text-sm opacity-70">Mode: {mode}</div>
      </div>

      <div
        style={{ height }}
        className={`rounded-lg border overflow-hidden relative ${
          theme === "light" ? "bg-white" : "bg-[#0b1220]"
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
