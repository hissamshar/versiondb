import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar, TopAppBar, BottomNav } from "./components/layout/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EasyTimetable — Student Dashboard",
  description: "Academic Tech Intelligence Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${jetbrainsMono.variable} h-full antialiased dark`}
    >
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet" />
      </head>
      <body className="bg-background text-on-surface flex min-h-screen font-body-md">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:p-4 focus:bg-primary focus:text-on-primary">Skip to content</a>
        
        <Sidebar />
        
        <main id="main-content" className="flex-1 flex flex-col min-w-0 pb-24 md:pb-0">
          <TopAppBar />
          <div className="flex-1 overflow-y-auto p-[16px] md:p-[32px] space-y-6 max-w-[1280px] mx-auto w-full">
            {children}
          </div>
        </main>

        <BottomNav />
      </body>
    </html>
  );
}
