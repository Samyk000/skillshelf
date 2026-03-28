import Link from "next/link";
import { Container } from "@/components/layout/Container";

export default function NotFound() {
  return (
    <Container className="flex flex-col items-center justify-center py-32">
      <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-primary">
        // 404
      </p>
      <h1 className="mb-4 font-display text-4xl font-bold tracking-wide">
        PAGE NOT FOUND
      </h1>
      <p className="mb-8 text-muted-foreground">
        The page you are looking for does not exist.
      </p>
      <Link
        href="/"
        className="border-2 border-primary bg-primary px-8 py-3 text-sm font-bold tracking-widest text-primary-foreground uppercase transition-colors hover:bg-transparent hover:text-primary"
      >
        GO HOME
      </Link>
    </Container>
  );
}
