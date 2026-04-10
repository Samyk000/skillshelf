import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { getBaseUrl } from "@/lib/url";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const baseUrl = getBaseUrl();

export const metadata: Metadata = {
  title: {
    default: "Skillshelf — Design Skill Library",
    template: "%s | Skillshelf",
  },
  description:
    "A curated library of design skills. Browse, preview, copy, and download SKILL.md files for your AI tools.",
  keywords: ["design skills", "AI tools", "SKILL.md", "design system", "cursor", "claude", "chatgpt"],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Skillshelf — Design Skill Library",
    description: "Browse, preview, and copy design skills for your AI tools.",
    type: "website",
    url: baseUrl,
  },
  alternates: {
    canonical: baseUrl,
  },
  robots: {
    index: true,
    follow: true,
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
      className={`${inter.variable} ${jetbrainsMono.variable}`}
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
