import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-lg border px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wider uppercase whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-1 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-accent-rose/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary/10 text-primary border-primary/20",
        secondary: "bg-muted/50 text-muted-foreground border-border",
        destructive: "bg-accent-rose/10 text-accent-rose border-accent-rose/20",
        outline: "bg-transparent text-foreground border-border hover:bg-muted/30",
        ghost: "bg-transparent text-muted-foreground border-transparent hover:bg-muted/30",
        success: "bg-accent-green/10 text-accent-green border-accent-green/20",
        warning: "bg-accent-amber/10 text-accent-amber border-accent-amber/20",
        info: "bg-accent-blue/10 text-accent-blue border-accent-blue/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
