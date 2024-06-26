"use client";

import { redirect } from "next/navigation";
import Link from "next/link";

import RouteHeader from "@/components/route-header";
import useAuthStore from "@/stores/auth";

// extract the URL query then redirect to /about
export default function Page() {
  const setAuthData = useAuthStore((state) => state.setAuthData);

  setAuthData({});

  return redirect("/about");

  // return (
  //   <div className="">
  //     <RouteHeader>Logout success</RouteHeader>
  //
  //     <Link href={"/about"}>Go back</Link>
  //   </div>
  // );
}
