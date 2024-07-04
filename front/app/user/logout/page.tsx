"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import useUserStore from "@/stores/auth";
import { useToast } from "@/components/ui/use-toast";
import { FailureRedirect } from "@/shared/constants";

// extract the URL query then redirect to /blog
export default function Page() {
  const { userData, setUserData } = useUserStore();

  const router = useRouter();

  const { toast } = useToast();

  // have to wrap every setState inside an useEffect because localStorage is
  // not available before componentDidMount
  useEffect(() => {
    toast({
      title: "User logged out.",
    });

    setUserData(undefined);
  }, [setUserData, toast]);

  /*
   * NOTE: only redirect after the userData is reset mean the SiteHeader is
   * already re-render, which help fix the annoy warning "Cannot update a
   * component (`SiteHeader`) while rendering a different component (`Page`).
   * */
  useEffect(() => {
    router.replace(FailureRedirect);
  }, [userData, router]);

  return null;
}
