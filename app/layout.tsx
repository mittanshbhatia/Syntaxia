import type { Metadata } from "next";
import { DM_Sans, Syne } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Syntaxia",
    template: "%s · Syntaxia",
  },
  description: "Syntaxia: home for APSDS chapters. Join, learn, or launch a school chapter.",
};

const themeBoot = `
(function(){
  try {
    var t = localStorage.getItem('syntaxia-theme');
    if (t !== 'light' && t !== 'dark') t = 'dark';
    document.documentElement.dataset.theme = t;
    document.documentElement.style.colorScheme = t;
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBoot }} />
      </head>
      <body
        className="site-shell min-h-screen antialiased"
        style={{
          ["--font-display" as string]: "var(--font-syne), Syne, system-ui, sans-serif",
          ["--font-body" as string]: "var(--font-dm), DM Sans, system-ui, sans-serif",
        }}
      >
        <ThemeProvider>
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          <SiteHeader />
          <div id="main">{children}</div>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
