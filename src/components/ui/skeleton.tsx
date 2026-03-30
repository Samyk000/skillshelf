import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn("animate-pulse bg-muted", className)}
      {...props}
    >
      <span className="sr-only">Loading…</span>
    </div>
  );
}

export { Skeleton };
