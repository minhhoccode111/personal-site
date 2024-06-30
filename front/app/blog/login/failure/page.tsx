"use client";

import Link from "next/link";

import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";

export default function Page() {
  const { toast } = useToast();

  useEffect(() => {
    toast({
      title: "Login failed.",
      variant: "destructive",
    });
  }, [toast]);

  return (
    <div className="">
      <header className="">
        <h3>Login with Google failed</h3>
      </header>

      <div className="">
        <Link href={"/blog/login"}>Click here to try login again</Link>
      </div>
    </div>
  );
}
