"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function QuantityStepper({
  value,
  onChange,
  max = 99,
  className,
}: {
  value: number;
  onChange: (v: number) => void;
  max?: number;
  className?: string;
}) {
  const isFullWidth = className?.includes("w-full");

  return (
    <div
      className={cn(
        "inline-flex items-center bg-slate-100/60 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 rounded-full p-0.5 gap-0.5 shrink-0",
        className
      )}
    >
      <button
        type="button"
        className={cn(
          "rounded-full bg-white dark:bg-slate-900 text-slate-800 dark:text-white border border-slate-200/30 dark:border-slate-800 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 active:bg-slate-100 dark:active:bg-slate-900/80 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs",
          isFullWidth ? "h-8 w-8" : "h-6 w-6"
        )}
        onClick={() => onChange(value - 1)}
      >
        {value === 1 ? (
          <Trash2 className={cn("text-red-500/80 dark:text-red-400", isFullWidth ? "size-4 stroke-[2]" : "size-3.5")} />
        ) : (
          <Minus className={isFullWidth ? "size-3.5" : "size-3"} />
        )}
      </button>
      <span className={cn("text-center font-bold text-slate-800 dark:text-white select-none", isFullWidth ? "text-sm w-8" : "text-xs w-6")}>
        {value}
      </span>
      <button
        type="button"
        className={cn(
          "rounded-full bg-white dark:bg-slate-900 text-slate-800 dark:text-white border border-slate-200/30 dark:border-slate-800 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 active:bg-slate-100 dark:active:bg-slate-900/80 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs",
          isFullWidth ? "h-8 w-8" : "h-6 w-6"
        )}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
      >
        <Plus className={isFullWidth ? "size-3.5" : "size-3"} />
      </button>
    </div>
  );
}
