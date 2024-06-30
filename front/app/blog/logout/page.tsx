"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import useAuthStore from "@/stores/auth";

// extract the URL query then redirect to /blog
export default function Page() {
  const { authData, setAuthData } = useAuthStore();

  const router = useRouter();

  // have to wrap every setState inside an useEffect because localStorage is
  // not available before componentDidMount
  useEffect(() => {
    setAuthData({});
  }, [setAuthData]);

  /*
   * NOTE: only redirect after the authData is reset mean the SiteHeader is
   * already re-render, which help fix the annoy warning "Cannot update a
   * component (`SiteHeader`) while rendering a different component (`Page`).
   * */
  useEffect(() => {
    router.replace("/blog");
  }, [authData, router]);

  return null;
}
