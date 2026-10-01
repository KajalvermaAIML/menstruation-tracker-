import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aurea — Clinical Menstrual Cycle Intelligence",
  description:
    "Production-grade, highly minimal, and discreet menstrual cycle tracking web application built with privacy-first client-side architecture.",
  applicationName: "Aurea",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Aurea",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FBFBFA" },
    { media: "(prefers-color-scheme: dark)", color: "#09090B" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[#FBFBFA] text-[#1E293B] antialiased transition-colors duration-200 dark:bg-[#09090B] dark:text-[#F8FAFC]">
        {children}
      </body>
    </html>
  );
}

