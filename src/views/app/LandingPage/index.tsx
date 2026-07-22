"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useMotionValue,
} from "motion/react";
import {
  Users,
  Home,
  Globe,
  Bot,
  Pencil,
  Zap,
  Palette,
  Trophy,
  Sparkles,
  ArrowRight,
  MousePointer,
  Paintbrush,
  Brain,
  Wifi,
  Lock,
  Globe2,
  Gamepad2,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import socket from "@/lib/socket";
import { useUserStore } from "@/store/app/userData";
import { useCreateRoom } from "@/hooks/rooms/useCreateRoom";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import MagneticButton from "@/components/ui/MagneticButton";
import TextReveal from "@/components/ui/TextReveal";
import ParallaxBlob from "@/components/ui/ParallaxBlob";
import ScrollReveal from "@/components/ui/ScrollReveal";
import GlowyCard from "@/components/ui/GlowyCard";

// MAIN LANDING PAGE
const GameLandingPage: React.FC = () => {
  const router = useRouter();
  const { mutateAsync: createRoom } = useCreateRoom();
  const { username, setUsername, setIsHost } = useUserStore();
  const isValid = username.length >= 4;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [isShowLoader, setIsShowLoader] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Mouse parallax for hero
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set((e.clientX - window.innerWidth / 2) / 50);
      mouseY.set((e.clientY - window.innerHeight / 2) / 50);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setUsername(value);
  };

  const handleCreateModalSubmit = async (mode: "private" | "global") => {
    const name = username.trim();
    if (!name || name.length < 4) return;
    setUsername(name);
    setIsHost(true);
    const roomId = nanoid(6);
    if (!socket.connected) socket.connect();
    try {
      setIsShowLoader(true);
      await createRoom({ roomId, username: name, mode });
    } catch (err) {
      console.error(err);
      setIsShowLoader(false);
    }
  };

  const handleCreateRoom = () => {
    if (!username) return;
    setIsCreateModalOpen(true);
  };

  const handleJoinRoom = () => {
    if (!username) return;
    setIsModalOpen(true);
  };

  const handleModalSubmit = () => {
    const trimmedRoomId = roomId.trim();
    if (!trimmedRoomId) return;
    setIsModalOpen(false);
    setIsShowLoader(true);
    router.push(`/game/${trimmedRoomId}`);
  };

  const handlePlayGlobally = () => {
    if (!username) return;
    if (!socket.connected) socket.connect();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    socket.emit("joinGlobalRoom", { username }, (res: any) => {
      if (!res.success) {
        console.error(res.message || "Failed to join global room.");
      } else {
        setIsShowLoader(true);
        router.push(`/game/${res.roomId}`);
      }
    });
  };

  const handlePlayAgainstAI = async () => {
    if (!username) return;
    const roomId = nanoid(6);
    try {
      setIsShowLoader(true);
      await createRoom({ roomId, username, mode: "ai" });
    } catch (err) {
      console.error(err);
      setIsShowLoader(false);
    }
  };

  const gameModes = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Join Room",
      description:
        "Enter a room code and jump straight into the action with friends.",
      gradient: "from-blue-600/80 to-indigo-700/80",
      glowColor: "rgba(59, 130, 246, 0.4)",
      onClick: handleJoinRoom,
      disabled: !isValid,
    },
    {
      icon: <Home className="w-8 h-8" />,
      title: "Create Room",
      description:
        "Host your own private or public room and invite others to play.",
      gradient: "from-purple-600/80 to-pink-700/80",
      glowColor: "rgba(168, 85, 247, 0.4)",
      onClick: handleCreateRoom,
      disabled: !isValid,
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Play Globally",
      description:
        "Match with random players from around the world in real-time.",
      gradient: "from-emerald-500/80 to-cyan-600/80",
      glowColor: "rgba(16, 185, 129, 0.4)",
      onClick: handlePlayGlobally,
      disabled: !isValid,
    },
    {
      icon: <Bot className="w-8 h-8" />,
      title: "Play Against AI",
      description:
        "Challenge our smart AI bot and sharpen your drawing skills.",
      gradient: "from-orange-500/80 via-pink-600/80 to-purple-700/80",
      glowColor: "rgba(236, 72, 153, 0.4)",
      onClick: handlePlayAgainstAI,
      disabled: !isValid,
    },
  ];

  const features = [
    {
      icon: <Zap className="w-6 h-6 text-yellow-400" />,
      title: "Real-Time Drawing",
      desc: "Smooth, lag-free canvas with instant sync across all players.",
    },
    {
      icon: <Palette className="w-6 h-6 text-pink-400" />,
      title: "Themed Rounds",
      desc: "Fresh word prompts and creative themes every round.",
    },
    {
      icon: <Trophy className="w-6 h-6 text-amber-400" />,
      title: "Competitive Leaderboard",
      desc: "Climb the ranks and show off your guessing skills.",
    },
    {
      icon: <Sparkles className="w-6 h-6 text-cyan-400" />,
      title: "AI Opponent",
      desc: "Practice anytime against our intelligent drawing AI.",
    },
    {
      icon: <Wifi className="w-6 h-6 text-green-400" />,
      title: "Global Rooms",
      desc: "Play with anyone, anywhere in the world instantly.",
    },
    {
      icon: <Lock className="w-6 h-6 text-purple-400" />,
      title: "Private Rooms",
      desc: "Exclusive invite-only rooms for you and your friends.",
    },
  ];

  const marqueeText = "DRAW • GUESS • WIN • CREATE • COMPETE • HAVE FUN • ";

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden"
    >
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 z-50 origin-left"
        style={{ scaleX }}
      />

      {/* ═══════ HERO SECTION ═══════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
        {/* Animated Background Blobs with Parallax */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            style={{ x: smoothMouseX, y: smoothMouseY }}
            className="absolute inset-0"
          >
            <ParallaxBlob
              color="bg-purple-600"
              size={400}
              top="10%"
              left="10%"
              delay={0}
            />
            <ParallaxBlob
              color="bg-blue-600"
              size={350}
              top="60%"
              left="70%"
              delay={0.5}
            />
            <ParallaxBlob
              color="bg-pink-600"
              size={300}
              top="30%"
              left="60%"
              delay={1}
            />
            <ParallaxBlob
              color="bg-cyan-600"
              size={250}
              top="70%"
              left="20%"
              delay={1.5}
            />
          </motion.div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#0a0a0f_70%)]" />
        </div>

        {/* Grid Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6 sm:mb-8"
          >
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-xs sm:text-sm font-medium text-gray-300">
              Real-time Drawing & Guessing Game
            </span>
          </motion.div>

          {/* Main Title with Letter Animation */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black mb-4 sm:mb-6 tracking-tight leading-[0.9]">
            <TextReveal
              text="Quick"
              className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
            />
            <br />
            <TextReveal
              text="Doodle"
              delay={0.3}
              className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent"
            />
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-base sm:text-xl md:text-2xl text-gray-400 font-light max-w-2xl mx-auto mb-8 sm:mb-12 px-4"
          >
            Draw, guess, and compete with friends or players worldwide.
            <br className="hidden sm:block" />
            <span className="text-gray-500">
              The fastest way to have fun with art.
            </span>
          </motion.p>

          {/* Username Input */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="mb-8 sm:mb-12"
          >
            <div className="relative max-w-md mx-auto px-4 sm:px-0">
              <input
                type="text"
                value={username}
                onChange={handleUsernameChange}
                placeholder="Enter your username..."
                className={`
                  w-full bg-white/5 border-2 rounded-2xl px-6 py-3 sm:py-4
                  text-base sm:text-lg text-white placeholder-gray-500
                  focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20
                  transition-all text-center backdrop-blur-sm
                  ${isValid ? "border-green-500/50" : "border-white/10"}
                `}
              />
              <AnimatePresence>
                {isValid && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    <Sparkles className="w-5 h-5 text-green-400" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <motion.p
              animate={{ opacity: isValid ? 0 : 1 }}
              className="text-xs sm:text-sm text-gray-500 mt-2"
            >
              Username must be at least 4 characters
            </motion.p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4"
          >
            <MagneticButton
              onClick={handleJoinRoom}
              disabled={!isValid}
              variant="primary"
              className="w-full sm:w-auto text-base sm:text-lg"
            >
              <Gamepad2 className="w-5 h-5" />
              Start Playing
              <ArrowRight className="w-5 h-5" />
            </MagneticButton>
            <MagneticButton
              onClick={() => {
                const el = document.getElementById("features");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              variant="secondary"
              className="w-full sm:w-auto"
            >
              <MousePointer className="w-4 h-4" />
              Explore Features
            </MagneticButton>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-5 h-8 sm:w-6 sm:h-10 rounded-full border-2 border-white/20 flex justify-center pt-1.5 sm:pt-2"
          >
            <motion.div
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-white"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════ MARQUEE SECTION ═══════ */}
      <section className="py-8 sm:py-12 overflow-hidden border-y border-white/5 bg-white/[0.02]">
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: "-50%" }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="flex whitespace-nowrap"
        >
          {[...Array(4)].map((_, i) => (
            <span
              key={i}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-black text-white/5 mx-2 sm:mx-4 select-none"
            >
              {marqueeText}
            </span>
          ))}
        </motion.div>
      </section>

      {/* ═══════ STATS SECTION ═══════ */}
      <section className="py-16 sm:py-24 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {[
            { value: 35999, suffix: "+", label: "Players Online" },
            { value: 799999, suffix: "+", label: "Games Played" },
            { value: 99, suffix: "%", label: "Uptime" },
            { value: 50, suffix: "ms", label: "Latency" },
          ].map((stat, i) => (
            <ScrollReveal key={i} delay={i * 0.1} className="text-center">
              <div className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-1 sm:mb-2">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-gray-500 text-xs sm:text-sm uppercase tracking-wider">
                {stat.label}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ═══════ FEATURES SECTION ═══════ */}
      <section id="features" className="py-16 sm:py-24 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal className="text-center mb-12 sm:mb-16">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-purple-400 font-medium tracking-wider uppercase text-xs sm:text-sm"
            >
              Features
            </motion.span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mt-3 sm:mt-4 mb-4 sm:mb-6">
              Everything you need to{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                have fun
              </span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-base sm:text-lg px-4">
              From private rooms with friends to global matchmaking, QuickDoodle
              has it all.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feature, i) => (
              <ScrollReveal key={i} delay={i * 0.1} direction="up">
                <motion.div
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="group p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-purple-500/30 hover:bg-white/[0.05] transition-colors backdrop-blur-sm"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/5 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {feature.desc}
                  </p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ GAME MODES SECTION (GLOWY CARDS) ═══════ */}
      <section className="py-16 sm:py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent" />
        <div className="max-w-6xl mx-auto relative z-10">
          <ScrollReveal className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-6">
              Choose Your{" "}
              <span className="bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">
                Battle Mode
              </span>
            </h2>
            <p className="text-gray-400 text-base sm:text-lg px-4">
              How do you want to play today?
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {gameModes.map((mode, i) => (
              <ScrollReveal key={i} delay={i * 0.15}>
                <GlowyCard {...mode} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ HOW IT WORKS SECTION ═══════ */}
      <section className="py-16 sm:py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-6">
              How It{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Works
              </span>
            </h2>
          </ScrollReveal>

          <div className="space-y-6 sm:space-y-8">
            {[
              {
                step: "01",
                title: "Draw",
                desc: "Get a word and draw it on the shared canvas. Use colors, brushes, and your imagination!",
                icon: <Paintbrush className="w-5 h-5 sm:w-6 sm:h-6" />,
                color: "from-blue-500 to-cyan-500",
              },
              {
                step: "02",
                title: "Guess",
                desc: "Watch others draw and type your guess as fast as you can. First correct guess wins!",
                icon: <Brain className="w-5 h-5 sm:w-6 sm:h-6" />,
                color: "from-purple-500 to-pink-500",
              },
              {
                step: "03",
                title: "Win",
                desc: "Climb the leaderboard, earn points, and become the ultimate QuickDoodle champion!",
                icon: <Trophy className="w-5 h-5 sm:w-6 sm:h-6" />,
                color: "from-amber-500 to-orange-500",
              },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.2} direction="left">
                <motion.div
                  whileHover={{ x: 10 }}
                  className="flex items-start gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-colors"
                >
                  <div
                    className={`
                      flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl
                      bg-gradient-to-br ${item.color}
                      flex items-center justify-center text-white font-black text-lg sm:text-xl
                    `}
                  >
                    {item.step}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                      {item.icon}
                      <h3 className="text-xl sm:text-2xl font-bold">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CTA SECTION ═══════ */}
      <section className="py-16 sm:py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-pink-900/20" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black mb-4 sm:mb-6">
              Ready to{" "}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Doodle?
              </span>
            </h2>
            <p className="text-base sm:text-xl text-gray-400 mb-6 sm:mb-8 px-4">
              Join thousands of players already drawing and guessing right now.
            </p>
            <MagneticButton
              onClick={handleJoinRoom}
              disabled={!isValid}
              variant="gradient"
              className="text-base sm:text-lg px-8 sm:px-10 py-4 sm:py-5"
            >
              <Pencil className="w-5 h-5" />
              Start Playing Now
              <ArrowRight className="w-5 h-5" />
            </MagneticButton>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="py-8 sm:py-12 px-4 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Pencil className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold">QuickDoodle</span>
          </div>
          <div className="flex items-center gap-4 sm:gap-6 text-gray-500 text-xs sm:text-sm">
            <span>Built with Next.js + Socket.IO</span>
            <span className="hidden sm:inline">•</span>
            <span>Real-time Fun</span>
          </div>
        </div>
      </footer>

      {/* ═══════ MODALS ═══════ */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsCreateModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#13131f] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative"
            >
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-xl sm:text-2xl font-bold mb-2">
                Create Room
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                Choose your room type and start playing immediately.
              </p>
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCreateModalSubmit("private")}
                  className="w-full p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/30 transition-all text-left flex items-center gap-4"
                >
                  <Lock className="w-5 h-5 text-purple-400" />
                  <div>
                    <div className="font-semibold">Private Room</div>
                    <div className="text-sm text-gray-500">
                      Invite-only with friends
                    </div>
                  </div>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCreateModalSubmit("global")}
                  className="w-full p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/30 transition-all text-left flex items-center gap-4"
                >
                  <Globe2 className="w-5 h-5 text-blue-400" />
                  <div>
                    <div className="font-semibold">Global Room</div>
                    <div className="text-sm text-gray-500">
                      Open to all players
                    </div>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#13131f] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-xl sm:text-2xl font-bold mb-2">Join Room</h3>
              <p className="text-gray-400 text-sm mb-6">
                Enter the room code to join the game.
              </p>
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Enter room code..."
                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all text-center text-lg tracking-widest uppercase mb-4"
                autoFocus
                onKeyPress={(e) => e.key === "Enter" && handleModalSubmit()}
              />
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-sm sm:text-base"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleModalSubmit}
                  className="flex-1 p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 font-semibold text-sm sm:text-base"
                >
                  Join Game
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loader */}
      <AnimatePresence>
        {isShowLoader && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#0a0a0f] flex items-center justify-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GameLandingPage;
