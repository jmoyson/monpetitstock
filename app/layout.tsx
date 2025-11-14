import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import Umami from "@/components/shared/umami";

export const metadata: Metadata = {
  metadataBase:
    process.env.NEXT_PUBLIC_APP_URL || new URL("https://www.monpetitstock.fr"),
  title: "Mon Petit Stock",
  description:
    "La solution la plus simple pour suivre votre inventaire. Gratuit, sans CB, prêt en 30 secondes.",
  openGraph: {
    title: "Mon Petit Stock",
    description:
      "La solution la plus simple pour suivre votre inventaire. Gratuit, sans CB, prêt en 30 secondes.",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://www.monpetitstock.fr",
    siteName: "Mon Petit Stock",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mon Petit Stock - Gérez votre stock en 2 clics",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mon Petit Stock",
    description:
      "La solution la plus simple pour suivre votre inventaire. Gratuit, sans CB, prêt en 30 secondes.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
        <Umami />
      </body>
    </html>
  );
}
