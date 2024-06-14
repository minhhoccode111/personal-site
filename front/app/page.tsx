import Image from "next/image";

import { Metadata } from "next";

import RouteHeader from "@/components/route-header";

export const metadata: Metadata = {
  title: `Home`,
};

export default function Home() {
  return (
    <>
      <RouteHeader>
        <Image
          src="/vercel.svg"
          alt="Vercel Logo"
          className="dark:invert"
          width={100}
          height={24}
          priority
        />
      </RouteHeader>
    </>
  );
}
