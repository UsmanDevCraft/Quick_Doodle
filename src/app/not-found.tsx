"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Home, ArrowLeft } from "lucide-react";
import Button from "@/components/Button/Button";

const NotFoundPage: React.FC = () => {
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/");
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl text-center">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-9xl sm:text-[12rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 tracking-tight leading-none">
            404
          </h1>
        </div>

        <div className="mb-12 animate-slide-up">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-gray-300 text-lg sm:text-xl font-light max-w-md mx-auto">
            The page yo&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up-delayed">
          <Button
            isOnlyClassName={true}
            onClick={handleGoHome}
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl active:scale-95 flex items-center justify-center gap-3 backdrop-blur-sm bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-purple-500/50"
          >
            <Home size={24} />
            <span>Go Home</span>
          </Button>

          <Button
            isOnlyClassName={true}
            onClick={handleGoBack}
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3 backdrop-blur-sm bg-white/10 hover:bg-white/20 text-white border border-white/20"
          >
            <ArrowLeft size={24} />
            <span>Go Back</span>
          </Button>
        </div>

        <div className="mt-16 text-gray-400 text-sm animate-fade-in-delayed">
          <p>Lost in space? Let&apos;s get you back to the game arena.</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out 0.2s backwards;
        }

        .animate-slide-up-delayed {
          animation: slide-up 0.8s ease-out 0.4s backwards;
        }

        .animate-fade-in-delayed {
          animation: fade-in 0.8s ease-out 0.6s backwards;
        }

        .delay-1000 {
          animation-delay: 1s;
        }

        .delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default NotFoundPage;
