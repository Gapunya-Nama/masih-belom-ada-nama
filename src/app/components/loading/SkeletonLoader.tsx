"use client";

import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/components/hooks/use-reduced-motion";

interface SkeletonLoaderProps {
  variant?: "card" | "text" | "avatar";
  className?: string;
}

export function SkeletonLoader({ variant = "text", className }: SkeletonLoaderProps) {
  const prefersReducedMotion = useReducedMotion();

  const variants = {
    card: "w-full h-32 rounded-lg",
    text: "w-full h-4 rounded",
    avatar: "w-12 h-12 rounded-full"
  };

  return (
    <div
      role="status"
      className="animate-pulse"
      aria-label="Loading"
    >
      <div
        className={cn(
          "bg-emerald-100",
          prefersReducedMotion ? "" : "animate-pulse",
          variants[variant],
          className
        )}
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
}