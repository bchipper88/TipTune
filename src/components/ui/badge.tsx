import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "warm" | "success" | "danger" | "muted";
}

export function Badge({ className, variant = "primary", children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        {
          "bg-primary/20 text-primary": variant === "primary",
          "bg-secondary/20 text-secondary": variant === "secondary",
          "bg-warm/20 text-warm": variant === "warm",
          "bg-success/20 text-success": variant === "success",
          "bg-danger/20 text-danger": variant === "danger",
          "bg-muted/20 text-muted": variant === "muted",
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
