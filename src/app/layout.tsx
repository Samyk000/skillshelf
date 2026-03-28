import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Skillshelf — Free Design Skill Library",
    template: "%s | Skillshelf",
  },
  description:
    "A curated library of free design skills. Browse, preview, copy, and download SKILL.md files for your AI tools.",
  keywords: ["design skills", "AI tools", "SKILL.md", "design system", "cursor", "claude", "chatgpt"],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Skillshelf — Free Design Skill Library",
    description: "Browse, preview, and copy design skills for your AI tools.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col bg-background text-foreground font-mono antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
