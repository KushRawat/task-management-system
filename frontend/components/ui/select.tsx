import { SelectHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

type Props = SelectHTMLAttributes<HTMLSelectElement>;

export const Select = forwardRef<HTMLSelectElement, Props>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={clsx(
        "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-300/50",
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
);

Select.displayName = "Select";
