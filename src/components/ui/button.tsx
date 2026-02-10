import { cn } from "@/lib/utils";
import { forwardRef, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "warm" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg disabled:opacity-50 disabled:pointer-events-none",
          {
            "bg-primary hover:bg-primary/90 text-white focus:ring-primary":
              variant === "primary",
            "bg-secondary hover:bg-secondary/90 text-white focus:ring-secondary":
              variant === "secondary",
            "bg-warm hover:bg-warm/90 text-white focus:ring-warm":
              variant === "warm",
            "bg-transparent hover:bg-card-bg text-text-white border border-border":
              variant === "ghost",
            "bg-danger hover:bg-danger/90 text-white focus:ring-danger":
              variant === "danger",
          },
          {
            "h-8 px-3 text-sm": size === "sm",
            "h-10 px-5 text-sm": size === "md",
            "h-12 px-8 text-base": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
