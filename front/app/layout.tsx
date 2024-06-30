"use client";

import { Inter as FontSans } from "next/font/google";

import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import ThemeProvider from "@/components/theme-provider";
import { useEffect } from "react";
import { AuthStoreName } from "@/shared/constants";
import useAuthStore from "@/stores/auth";

const fontSans = FontSans({ subsets: ["latin"], variable: "--font-sans" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { setAuthData } = useAuthStore();

  // have to init authData here and wrap inside a useEffect which run after componentDidMount
  // which make localStorage accessible or else get a referenceError
  useEffect(() => {
    const data = localStorage.getItem(AuthStoreName);

    const authData = data ? JSON.parse(data) : {};

    console.log(`init authData belike: `, authData);

    setAuthData(authData);
  }, [setAuthData]);

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
        </ThemeProvider>
      </body>
    </html>
  );
}
