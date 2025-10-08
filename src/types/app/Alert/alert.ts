export interface AlertProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number; // Auto-close duration in milliseconds (0 = no auto-close)
}
