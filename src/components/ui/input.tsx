import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-xl border border-border bg-surface/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-all duration-200 outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground hover:bg-surface focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted/30 aria-invalid:border-accent-rose/50 aria-invalid:ring-2 aria-invalid:ring-accent-rose/20 dark:bg-surface/30 dark:hover:bg-surface/50 dark:disabled:bg-muted/20",
        className
      )}
      {...props}
    />
  )
}

export { Input }
