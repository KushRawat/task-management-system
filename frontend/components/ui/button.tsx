import { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  icon?: ReactNode;
  loading?: boolean;
  size?: "sm" | "md";
};

export const Button = ({
  children,
  className,
  variant = "primary",
  icon,
  loading = false,
  size = "md",
  ...props
}: ButtonProps) => {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
    md: "px-4 py-2 text-sm font-semibold",
    sm: "px-3 py-1.5 text-xs font-semibold",
  };
  const styles: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary:
      "bg-primary-600 text-white shadow-md hover:bg-primary-700 active:scale-[0.99] focus-visible:outline-primary-300 dark:bg-primary-500 dark:hover:bg-primary-400",
    secondary:
      "bg-white text-primary-700 border border-neutral-200 hover:bg-neutral-50 focus-visible:outline-primary-300 dark:bg-neutral-800 dark:text-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-700",
    ghost:
      "text-neutral-700 hover:bg-neutral-100 focus-visible:outline-primary-300 dark:text-neutral-200 dark:hover:bg-neutral-800",
    danger:
      "bg-danger text-white shadow hover:bg-red-600 active:scale-[0.99] focus-visible:outline-red-200",
  };

  return (
    <button
      className={clsx(base, sizes[size], styles[variant], className)}
      type={props.type || "button"}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white dark:border-neutral-300 dark:border-t-white" />
      )}
      {icon}
      {children}
    </button>
  );
};
