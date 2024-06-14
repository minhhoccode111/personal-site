// "use client";

import { Metadata } from "next";

import RouteHeader from "@/components/route-header";

export const metadata: Metadata = {
  title: `Login`,
};

export default function Page() {
  return (
    <>
      <RouteHeader>Login</RouteHeader>

      <div className="">
        <form className=""></form>
      </div>
    </>
  );
}
