import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-gradient-primary text-primary-foreground hover:scale-105 shadow-md hover:shadow-glow",
        secondary: "border-transparent bg-gradient-accent text-secondary-foreground hover:scale-105 shadow-md hover:shadow-glow",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:scale-105 shadow-md",
        outline: "text-foreground border-primary/30 hover:bg-primary/10 hover:border-primary/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
