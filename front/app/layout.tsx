"use client";

import { Inter as FontSans } from "next/font/google";

import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import ThemeProvider from "@/components/theme-provider";

const fontSans = FontSans({ subsets: ["latin"], variable: "--font-sans" });

import { Toaster } from "@/components/ui/toaster";
import { useFetchUser } from "@/hooks";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const _ = useFetchUser();

  return (
    <html lang="en" suppressHydrationWarning>
      {/* theme wrapper */}
      <head>
        <title>mhc111</title>
      </head>

      <body
        className={cn(
          "min-h-screen flex flex-col justify-between font-sans antialiased text-dark dark:text-light bg-light dark:bg-dark font-extralight",
          fontSans.className,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {/* header */}
          <SiteHeader />

          {/* nav */}

          {/* main */}
          <main className="flex-1 self-center max-w-xl w-full">{children}</main>

          {/* footer */}
          <SiteFooter />

          {/* toaster to popup */}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
