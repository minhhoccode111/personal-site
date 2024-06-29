"use client";

import RouteHeader from "@/components/route-header";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="">
      <RouteHeader>Contact</RouteHeader>
      {children};
    </div>
  );
}
