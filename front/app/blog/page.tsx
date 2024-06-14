import { Metadata } from "next";

import RouteHeader from "@/components/route-header";

export const metadata: Metadata = {
  title: `Blog`,
};

export default function Page() {
  return (
    <>
      <RouteHeader>Blog</RouteHeader>
    </>
  );
}
