"use client";

import NavBar from "@/components/nav-bar";
import RouteHeader from "@/components/route-header";
import { useMemo } from "react";
import useAuthStore from "@/stores/auth";

// NOTE: need route layout to check and display links base on auth and authz

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { authData } = useAuthStore();

  const links = useMemo(() => {
    // no auth links
    if (!authData.user) {
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
    if (authData.user?.isAuthor) {
      authLinks.push({ href: "/admin", text: "admin" });
    }

    return authLinks;
  }, [authData]);

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
