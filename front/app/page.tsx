"use client";

import { redirect } from "next/navigation";

// no /index redirect to /about by default
export default function Home() {
  redirect("/about");

  return null;
}
