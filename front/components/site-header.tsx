"use client";

import { useMemo } from "react";
import Link from "next/link";
import NavBar from "./nav-bar";

import ThemeToggler from "./theme-toggler";

export default function SiteHeader() {
  // remember links
  const links = useMemo(
    () => [
      { href: "about", text: "about" },
      { href: "work", text: "work" },
      { href: "blog", text: "blog" },
      { href: "contact/add", text: "contact" },
    ],
    [],
  );

  return (
    <header className="flex items-center justify-between p-2">
      <div className="">
        <h1 className="text-2xl">
          <Link href={"/about"}>mhc111</Link>
        </h1>
      </div>

      <NavBar prefixHref="/" links={links} />

      <div className="">
        <ThemeToggler />
      </div>
    </header>
  );
}
