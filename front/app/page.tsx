"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

// no /index redirect to /about by default
export default function Home() {
  const router = useRouter();

  // trigger the redirect inside a useEffect hook so that it happens after the
  // component has mounted, rather than during the render
  useEffect(() => {
    router.push("/about");
  }, [router]);

  return null;
}
