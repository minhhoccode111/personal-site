"use client";

import React, { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  exact?: boolean;
  children: ReactNode;
  activeClassName?: string;
  className?: string;
}

// custom nav link because nextjs don't have one
const NavLink: React.FC<NavLinkProps> = ({
  href,
  exact = false,
  children,
  activeClassName = "active", // check global.css, override if needed
  className = "",
}) => {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.includes(href);

  return (
    <Link href={href} className={cn(className, isActive && activeClassName)}>
      {children}
    </Link>
  );
};

export default NavLink;
