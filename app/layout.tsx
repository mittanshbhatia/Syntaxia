import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SiteBackgroundVideo } from "@/components/SiteBackgroundVideo";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Syntaxia",
    template: "%s · Syntaxia",
  },
  description:
    "The AI-native computer science learning platform. Teach students to think, not just code.",
  openGraph: {
    title: "Syntaxia",
    description: "The AI-native computer science curriculum for schools.",
    type: "website",
    url: "https://syntaxia.org",
  },
  twitter: {
    card: "summary_large_image",
    title: "Syntaxia",
    description: "Teach students to think, not just code.",
  },
  metadataBase: new URL("https://syntaxia.org"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} data-theme="dark" style={{ colorScheme: "dark" }}>
      <body
        className="site-shell min-h-screen antialiased"
        style={{
          ["--font-display" as string]: "var(--font-inter), Inter, system-ui, sans-serif",
          ["--font-body" as string]: "var(--font-inter), Inter, system-ui, sans-serif",
        }}
      >
        <SiteBackgroundVideo />
        <div className="site-foreground">
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          <SiteHeader />
          <div id="main">{children}</div>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
