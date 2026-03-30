import Link from "next/link";
import { Container } from "./Container";

const CURRENT_YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="border-t-2 border-border bg-muted">
      <Container>
        <div className="flex flex-col items-center justify-between gap-2 py-4 md:flex-row">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-display text-sm font-bold tracking-wider text-primary uppercase"
          >
            <span className="border-2 border-primary px-1.5 py-0.5 text-primary text-xs">
              {"//"}
            </span>
            <span>SKILLSHELF</span>
          </Link>

          {/* Copyright */}
          <p className="text-xs tracking-wider text-muted-foreground">
            &copy; {CURRENT_YEAR} SKILLSHELF. ALL RIGHTS RESERVED.
          </p>
        </div>
      </Container>
    </footer>
  );
}
