import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToasterProvider } from "@/components/ui/toaster";
import { NextAuthProvider } from "@/components/providers/NextAuthProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Repo Radar",
  description: "GitHub Repository Analysis Tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased dark bg-[#1a1b1e]`}
      >
        <NextAuthProvider>
          {children}
        </NextAuthProvider>
        <ToasterProvider />
      </body>
    </html>
  );
}
