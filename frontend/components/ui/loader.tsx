export const Loader = () => (
  <div className="flex items-center gap-2 text-sm text-slate-300">
    <span className="h-2 w-2 animate-pulse rounded-full bg-brand-300" />
    <span className="h-2 w-2 animate-pulse rounded-full bg-brand-300 delay-150" />
    <span className="h-2 w-2 animate-pulse rounded-full bg-brand-300 delay-300" />
    <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
      Loading
    </span>
  </div>
);
