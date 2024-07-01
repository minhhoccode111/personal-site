"use client";

import NavBar from "@/components/nav-bar";
import RouteHeader from "@/components/route-header";
import { useMemo } from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const links = useMemo(
    () => [
      { href: "add", text: "add" },
      { href: "all", text: "all" },
    ],
    [],
  );

  return (
    <div className="">
      <RouteHeader
        isHeaderLink={false}
        nav={<NavBar prefixHref="/contact/" links={links} />}
      >
        contact
      </RouteHeader>

      {children}
    </div>
  );
}
