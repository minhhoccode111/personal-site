import { Metadata } from "next";

import RouteHeader from "@/components/route-header";

export const metadata: Metadata = {
  title: `Sign up`,
};

export default function Page() {
  return (
    <>
      <RouteHeader>Sign up</RouteHeader>

      <div className="">
        <form className=""></form>
      </div>
    </>
  );
}
