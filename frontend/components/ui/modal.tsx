import { ReactNode } from "react";
import { X } from "lucide-react";
import { Card } from "./card";

export const Modal = ({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 px-4 backdrop-blur">
      <Card className="relative w-full max-w-lg border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
        <button
          aria-label="Close"
          className="absolute right-4 top-4 text-neutral-400 hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-200"
          onClick={onClose}
        >
          <X size={18} />
        </button>
        <h3 className="mb-4 text-xl font-semibold text-neutral-900 dark:text-white">{title}</h3>
        {children}
      </Card>
    </div>
  );
};
