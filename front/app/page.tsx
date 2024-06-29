"use client";

import { useRouter } from "next/navigation";

// no /index redirect to /about by default
export default function Home() {
  useRouter().push("/about");

  return null;
}
