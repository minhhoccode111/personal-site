"use client";

import NavBar from "@/components/nav-bar";
import RouteHeader from "@/components/route-header";
import { useMemo } from "react";
import useUserStore from "@/stores/auth";

// NOTE: need route layout to check and display links base on auth and authz
export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userData } = useUserStore();

  const links = useMemo(() => {
    // no auth links
    if (!userData) {
      return [
        { href: "/signup", text: "signup" },
        { href: "/login", text: "login" },
      ];
    }

    // auth links
    const authLinks = [
      { href: "/edit", text: "edit" },
      { href: "/logout", text: "logout" },
    ];

    // authz links
    if (userData?.isAuthor) {
      authLinks.push({ href: "/admin", text: "admin" });
    }

    return authLinks;
  }, [userData]);

  return (
    <div className="">
      <RouteHeader
        isHeaderLink={true}
        nav={<NavBar prefixHref="/user" links={links} />}
      >
        user
      </RouteHeader>

      {children}
    </div>
  );
}
