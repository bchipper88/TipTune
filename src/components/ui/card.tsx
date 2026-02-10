import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: "warm" | "primary" | "none";
}

export function Card({ className, glow = "none", children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card-bg p-5",
        glow === "warm" && "glow-warm",
        glow === "primary" && "glow-primary",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
