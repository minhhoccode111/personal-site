"use client";

import { useMemo } from "react";
import Link from "next/link";

import ThemeToggler from "./theme-toggler";

export default function SiteHeader() {
  // remember links
  const links = useMemo(() => ["about", "blog", "contact"], []);

  return (
    <header className="flex items-center justify-between p-8">
      <div className="">
        <h1 className="text-2xl">
          <Link href={"/about"}>mhc111</Link>
        </h1>
      </div>

      <nav className="">
        <ul className="flex gap-2">
          {links.map((item) => (
            <li key={item} className="">
              <Link href={"/" + item}>{item}</Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="">
        <ThemeToggler />
      </div>
    </header>
  );
}
