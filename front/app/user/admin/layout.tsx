"use client";

import NavBar from "@/components/nav-bar";
import { useMemo } from "react";
import useVerifyAuth from "@/hooks/useVerifyAuth";
import useUserStore from "@/stores/auth";
import SectionHeader from "@/components/section-header";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userData: authData } = useUserStore();

  // redirect to /user if not authz
  const _ = useVerifyAuth({
    user: authData.user,
    isAuthz: true,
    failureRedirect: "/user",
  });

  const links = useMemo(
    () => [
      { href: "/blog", text: "blog" },
      { href: "/contact", text: "contact" },
      { href: "/skill", text: "skill" },
      { href: "/work", text: "work" },
    ],
    [],
  );

  const nav = <NavBar links={links} prefixHref={"/user/admin"}></NavBar>;

  return (
    <div className="">
      <SectionHeader nav={nav}>admin</SectionHeader>

      {children}
    </div>
  );
}
