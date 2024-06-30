"use client";

import { useMemo } from "react";
import Link from "next/link";
import NavLink from "./nav-link";

import ThemeToggler from "./theme-toggler";

export default function SiteHeader() {
  // remember links
  const links = useMemo(() => ["about", "work", "blog", "contact"], []);

  return (
    <header className="flex items-center justify-between p-2">
      <div className="">
        <h1 className="text-2xl">
          <Link href={"/about"}>mhc111</Link>
        </h1>
      </div>

      <nav className="">
        <ul className="flex gap-2">
          {links.map((item) => (
            <li key={item} className="">
              <NavLink className="" href={"/" + item}>
                {item}
              </NavLink>
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
