"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import useAuthStore from "@/stores/auth";

// extract the URL query then redirect to /blog
export default function Page() {
  const { authData, setAuthData } = useAuthStore();

  const router = useRouter();

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
    router.push("/blog");
  }, [authData, router]);

  return null;
}
