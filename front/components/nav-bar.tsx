"use client";

import NavLink from "./nav-link";

type LinkType = {
  href: string;
  text: string;
};

type NavBarType = {
  links: LinkType[];
  prefixHref: string;
};

export default function NavBar({ links, prefixHref = "/" }: NavBarType) {
  return (
    <nav className="">
      <ul className="flex gap-2">
        {links.map((link) => (
          <li key={link.text} className="">
            <NavLink href={prefixHref + link.href}>{link.text}</NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
