"use client";

import { redirect } from "next/navigation";
// import Link from "next/link";

// import RouteHeader from "@/components/route-header";
import useAuthStore from "@/stores/auth";
import { useRouter } from "next/router";
import { useEffect } from "react";
import RouteHeader from "@/components/route-header";
import Link from "next/link";

// extract the URL query then redirect to /about
export default function Page() {
  const { authData, setAuthData } = useAuthStore();

  // run this reset authData first to logout
  useEffect(() => {
    setAuthData({});
  }, [setAuthData]);

  /*
   * NOTE: only redirect after the authData is reset mean the SiteHeader is
   * already re-render, which help fix the annoy warning "Cannot update a
   * component (`SiteHeader`) while rendering a different component (`Page`).
   * */
  useEffect(() => {
    redirect("/about");
  }, [authData]);

  return null;
}
