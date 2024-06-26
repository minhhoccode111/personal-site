"use client";

import { useMemo } from "react";
import Link from "next/link";

import ThemeToggler from "./theme-toggler";

import useAuthStore from "@/stores/auth";

export default function SiteHeader() {
  const authData = useAuthStore((state) => state.authData);

  // remember links
  const links = useMemo(
    () => [
      { href: "/about", text: "about" },
      { href: "/blog", text: "blog" },
      { href: "/contact", text: "contact" },
      { href: "/work", text: "work" },
      { href: "/login", text: "login" },
      { href: "/signup", text: "signup" },
      { href: "/logout", text: "logout" },
      // { href: "/dummy", text: "dummy" },
    ],
    [],
  );

  return (
    <header className="flex items-center justify-between p-8">
      <div className="">
        <h1 className="text-2xl">
          <Link href={"/about"}>mhc111</Link>
        </h1>
      </div>

      <nav className="">
        <ul className="flex gap-2">
          {links.reduce((total: React.ReactNode[], item) => {
            const text = item.text;

            // if user not login and text is logout then skip
            if (text === "logout" && !authData.user) return total;

            // if user logged in and text is login or sign up then skip
            if ((text === "login" || text === "signup") && authData.user) {
              return total;
            }

            // else display link in the array
            const current = (
              <li key={item.text} className="">
                <Link href={item.href}>{item.text}</Link>
              </li>
            );

            return [...total, current];
          }, [])}
        </ul>
      </nav>

      <div className="">
        <ThemeToggler />
      </div>
    </header>
  );
}
