import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { UserSync } from "@/components/user";

const geist = Geist({ 
  subsets: ["latin"],
  display: 'swap',
});

// Removed unused font
// const geistMono = Geist_Mono({ 
//   subsets: ["latin"],
//   display: 'swap',
// });

export const metadata: Metadata = {
  title: "GetShipKit - A SaaS boilerplate",
  description: "The perfect starting point for your next project with GetShipKit.",
  manifest: "/site.webmanifest",
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="manifest" href="/site.webmanifest" />
        {/* Removed manual stylesheet inclusion - CSS should be imported in the component or use CSS modules */}
        <style dangerouslySetInnerHTML={{ __html: `
          body { 
            margin: 0;
            display: flex;
            flex-direction: column;
            min-height: 100vh;
          }
          .dark {
            color-scheme: dark;
          }
        `}} />
      </head>
      <body className={`${geist.className} dark:bg-[#030712] dark:text-gray-100 bg-white text-gray-900`} suppressHydrationWarning>
        <Providers>
          <UserSync />
          {children}
        </Providers>
      </body>
    </html>
  );
}
