import Link from "next/link";
import ThemeToggler from "./theme-toggler";

export default function SiteHeader() {
  const links = [
    { href: "/", text: "Home" },
    { href: "/contact", text: "Contact" },
    { href: "/about", text: "About" },
    // { href: "/dummy", text: "Dummy" },
    { href: "/blog", text: "Blog" },
    { href: "/login", text: "Login" },
    { href: "/signup", text: "Signup" },
    { href: "/logout", text: "Logout" },
  ];

  return (
    <header className="flex items-center justify-between p-8">
      <div className="">
        <h1 className="text-2xl">mhc111</h1>
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
