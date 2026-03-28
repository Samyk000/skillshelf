import Link from "next/link";
import { Container } from "./Container";

const footerLinks = [
  { href: "/skills", label: "EXPLORE" },
  { href: "/login", label: "LOGIN" },
  { href: "/signup", label: "SIGN UP" },
];

export function Footer() {
  return (
    <footer className="border-t-2 border-border bg-muted">
      <Container>
        <div className="flex flex-col items-center justify-between gap-6 py-8 md:flex-row">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-display text-lg font-bold tracking-wider text-primary uppercase"
          >
            <span className="border-2 border-primary px-2 py-0.5 text-primary">
              {"//"}
            </span>
            <span>SKILLSHELF</span>
          </Link>

          {/* Links */}
          <nav className="flex items-center gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs font-semibold tracking-widest text-muted-foreground uppercase transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Copyright */}
          <p className="text-xs tracking-wider text-muted-foreground">
            &copy; {new Date().getFullYear()} SKILLSHELF. ALL RIGHTS RESERVED.
          </p>
        </div>
      </Container>
    </footer>
  );
}
