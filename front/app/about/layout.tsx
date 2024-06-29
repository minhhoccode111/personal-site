// NOTE: template of a layout, can use Layout component to create a
// Protect-route-wrapper to redirect to /login if user in authData is Not Found

"use client";

import RouteHeader from "@/components/route-header";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="">
      <RouteHeader>about</RouteHeader>

      {children}
    </div>
  );
}
