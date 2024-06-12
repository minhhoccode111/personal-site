import Link from "next/link";
import ThemeToggler from "./theme-toggler";

export default function SiteHeader() {
  const links = [
    { href: "/", text: "Home" },
    { href: "/contact", text: "Contact" },
    { href: "/about", text: "About" },
    { href: "/dummy", text: "Dummy" },
  ];

  return (
    <header className="flex items-center justify-between p-8">
      <div className="">
        <h1 className="text-2xl">Site Name</h1>
      </div>

      <nav className="flex gap-2">
        {links.map((item) => (
          <Link key={item.text} href={item.href}>
            {item.text}
          </Link>
        ))}
      </nav>

      <div className="">
        <ThemeToggler />
      </div>
    </header>
  );
}
