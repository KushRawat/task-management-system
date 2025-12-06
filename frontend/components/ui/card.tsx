import clsx from "clsx";
import { ReactNode } from "react";

export const Card = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div className={clsx("glass rounded-2xl p-6 shadow-card", className)}>
    {children}
  </div>
);
