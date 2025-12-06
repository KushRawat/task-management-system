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
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <Card className="relative w-full max-w-lg border border-white/10">
        <button
          aria-label="Close"
          className="absolute right-4 top-4 text-slate-400 hover:text-white"
          onClick={onClose}
        >
          <X size={18} />
        </button>
        <h3 className="mb-4 text-xl font-semibold text-white">{title}</h3>
        {children}
      </Card>
    </div>
  );
};
