import React, { useEffect } from "react";
import { AlertCircle, CheckCircle, XCircle, Info, X } from "lucide-react";
import { AlertProps } from "@/types/app/Alert/alert";

const Alert: React.FC<AlertProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type = "info",
  duration = 0,
}) => {
  useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const typeConfig = {
    success: {
      icon: <CheckCircle size={24} />,
      gradient: "from-emerald-500 to-teal-600",
      iconColor: "text-emerald-400",
      bgGlow: "bg-emerald-500",
    },
    error: {
      icon: <XCircle size={24} />,
      gradient: "from-red-500 to-pink-600",
      iconColor: "text-red-400",
      bgGlow: "bg-red-500",
    },
    warning: {
      icon: <AlertCircle size={24} />,
      gradient: "from-orange-500 to-yellow-600",
      iconColor: "text-orange-400",
      bgGlow: "bg-orange-500",
    },
    info: {
      icon: <Info size={24} />,
      gradient: "from-blue-500 to-purple-600",
      iconColor: "text-blue-400",
      bgGlow: "bg-blue-500",
    },
  };

  const config = typeConfig[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Alert */}
      <div className="relative w-full max-w-sm bg-gradient-to-br from-slate-800/95 to-purple-900/95 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl animate-scale-in overflow-hidden p-4">
        {/* Animated background blob */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={`absolute top-0 right-0 w-32 h-32 ${config.bgGlow} rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse`}
          />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white z-10 cursor-pointer p-1"
        >
          <X size={18} />
        </button>

        {/* Content */}
        <div className="relative pt-4">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className={`flex-shrink-0 ${config.iconColor}`}>
              {config.icon}
            </div>

            {/* Text content */}
            <div className="flex-1 pt-0.5">
              {title && (
                <h3 className="text-lg font-semibold text-white mb-1">
                  {title}
                </h3>
              )}
              <p className="text-gray-300 text-sm leading-relaxed">{message}</p>
            </div>
          </div>

          {/* Action button */}
          <div className="mt-6">
            <button
              onClick={onClose}
              className={`w-full px-4 py-3 rounded-lg font-semibold bg-gradient-to-r ${config.gradient} hover:opacity-90 text-white transition-all transform hover:scale-105 active:scale-95`}
            >
              Got it
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Alert;
