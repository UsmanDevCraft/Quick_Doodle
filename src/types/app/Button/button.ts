export interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "accent";
  icon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  isOnlyClassName?: boolean;
}
