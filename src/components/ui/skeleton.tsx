import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn("animate-shimmer", className)}
      {...props}
    >
      <span className="sr-only">Loading…</span>
    </div>
  );
}

export { Skeleton };
