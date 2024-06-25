import Link from "next/link";

import ThemeToggler from "./theme-toggler";

import useAuthStore from "@/stores/auth";

export default function SiteHeader() {
  const authData = useAuthStore((state) => state.authData);

  const links = [
    // { href: "/", text: "Home" },
    { href: "/about", text: "About" },
    { href: "/blog", text: "Blog" },
    { href: "/contact", text: "Contact" },
    { href: "/work", text: "Work" },
    { href: "/login", text: "Login" },
    { href: "/signup", text: "Signup" },
    { href: "/logout", text: "Logout" },
    // { href: "/dummy", text: "Dummy" },
  ];

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
            <li key={item.text} className="">
              <Link href={item.href}>{item.text}</Link>
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
