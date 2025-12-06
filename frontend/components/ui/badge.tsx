import clsx from "clsx";
import { ReactNode } from "react";

type Variant = "green" | "amber" | "blue";

export const Badge = ({
  children,
  variant = "blue",
}: {
  children: ReactNode;
  variant?: Variant;
}) => {
  const styles: Record<Variant, string> = {
    green:
      "bg-emerald-500/15 text-emerald-200 border border-emerald-400/40 shadow-inner shadow-emerald-400/20",
    amber:
      "bg-amber-500/15 text-amber-200 border border-amber-400/40 shadow-inner shadow-amber-400/20",
    blue: "bg-cyan-500/15 text-cyan-100 border border-cyan-400/40",
  };

  return (
    <span className={clsx("rounded-full px-3 py-1 text-xs font-semibold", styles[variant])}>
      {children}
    </span>
  );
};
