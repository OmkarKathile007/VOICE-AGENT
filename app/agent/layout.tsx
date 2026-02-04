import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../../app/globals.css";
import { Sidebar } from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Krishi-Shetra AI",
  description: "Voice-First Agricultural Intelligence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#020617] text-slate-100`}
      >
        <div className="flex min-h-screen">
          {/* 1. Sidebar stays fixed on the left */}
          <Sidebar />

          {/* 2. Main Content pushed to the right */}
          <main className="flex-1 ml-20 md:ml-64 p-6 md:p-8 relative">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}