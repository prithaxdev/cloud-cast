import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default:   "bg-primary/10 text-primary",
        secondary: "bg-secondary text-secondary-foreground",
        warning:   "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
        danger:    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
