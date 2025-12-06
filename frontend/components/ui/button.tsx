import { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  icon?: ReactNode;
};

export const Button = ({
  children,
  className,
  variant = "primary",
  icon,
  ...props
}: ButtonProps) => {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const styles: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary:
      "bg-gradient-to-r from-brand-500 to-cyan-400 text-slate-900 shadow-lg shadow-cyan-500/20 hover:-translate-y-0.5 focus-visible:outline-brand-300",
    secondary:
      "bg-white/10 text-white border border-white/10 hover:bg-white/15 focus-visible:outline-brand-300",
    ghost:
      "text-slate-200 hover:text-white hover:bg-white/5 focus-visible:outline-brand-300",
  };

  return (
    <button
      className={clsx(base, styles[variant], className)}
      type={props.type || "button"}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
};
