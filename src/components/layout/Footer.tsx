import Link from "next/link";
import { Container } from "./Container";

const CURRENT_YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <Container>
        <div className="py-8 flex flex-col items-center justify-between gap-6 md:flex-row md:py-10">
          <div className="flex flex-col items-center gap-4 md:flex-row md:gap-8">
            <Link href="/" className="flex items-center gap-2.5 font-display text-lg font-semibold tracking-tight text-foreground group transition-opacity hover:opacity-80">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10 text-primary text-xs font-mono font-bold group-hover:bg-primary group-hover:text-white transition-all duration-300">{"//"}</span>
              <span>Skillshelf</span>
            </Link>
            <p className="text-xs text-muted-foreground/60 tracking-wide font-medium border-t border-border pt-4 md:border-t-0 md:pt-0 md:border-l md:pl-8">
              &copy; {CURRENT_YEAR} SKILLSHELF. WORKBENCH INTERFACE.
            </p>
          </div>
          
          <div className="flex items-center gap-6 text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase transition-colors">
             {/* Simple minimalist status or indicator if needed, else just space */}
             <span className="flex items-center gap-2">
               <span className="w-1 h-1 rounded-full bg-primary" />
               SYSTEM OPERATIONAL
             </span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
