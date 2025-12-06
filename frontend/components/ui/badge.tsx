import clsx from "clsx";
import { ReactNode } from "react";

type Variant = "primary" | "success" | "warning" | "danger" | "neutral";

export const Badge = ({
  children,
  variant = "primary",
}: {
  children: ReactNode;
  variant?: Variant;
}) => {
  const styles: Record<Variant, string> = {
    primary:
      "bg-primary-50 text-primary-700 border border-primary-200 dark:bg-primary-900/30 dark:text-primary-100 dark:border-primary-800",
    success:
      "bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-100 dark:border-green-800",
    warning:
      "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-100 dark:border-amber-800",
    danger:
      "bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-100 dark:border-red-800",
    neutral:
      "bg-neutral-100 text-neutral-700 border border-neutral-200 dark:bg-neutral-800 dark:text-neutral-100 dark:border-neutral-700",
  };

  return (
    <span className={clsx("inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold", styles[variant])}>
      {children}
    </span>
  );
};
