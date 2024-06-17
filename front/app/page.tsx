import Image from "next/image";

import RouteHeader from "@/components/route-header";

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
