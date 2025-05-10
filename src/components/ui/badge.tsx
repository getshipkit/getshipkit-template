import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-emerald-500 text-white hover:bg-emerald-600",
        secondary:
          "border-transparent bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700",
        destructive:
          "border-transparent bg-red-500 text-white hover:bg-red-600",
        outline: 
          "text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants }; 