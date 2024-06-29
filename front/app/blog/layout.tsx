"use client";

import RouteHeader from "@/components/route-header";
import useAuthStore from "@/stores/auth";
import Link from "next/link";
import { useMemo } from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authData = useAuthStore((state) => state.authData);

  // remember links
  const links = useMemo(() => ["login", "signup", "logout"], []);

  const nav = (
    <nav className="">
      <ul className="flex gap-2">
        {links.reduce((total: React.ReactNode[], item) => {
          // if user not login in, don't display /logout
          if (item === "logout" && !authData.user) return total;

          // if user logged in, don't display /login and /signup
          if ((item === "login" || item === "signup") && authData.user) {
            return total;
          }

          // else display links
          const current = (
            <li key={item} className="">
              <Link href={"/blog/" + item}>{item}</Link>
            </li>
          );

          return [...total, current];
        }, [])}
      </ul>
    </nav>
  );

  return (
    <div className="">
      {/* have nav to navigate to login, signup to comment on posts */}
      <RouteHeader nav={nav}>Blog</RouteHeader>

      {children}
    </div>
  );
}
