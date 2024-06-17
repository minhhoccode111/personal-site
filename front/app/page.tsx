import Image from "next/image";

import RouteHeader from "@/components/route-header";

export default function Home() {
  return (
    <>
      <RouteHeader>
        <div className="">
          {/* <Image
            src="/vercel.svg"
            alt="Vercel Logo"
            className="dark:invert block w-full"
            width={100}
            height={24}
            priority
          /> */}
        </div>
      </RouteHeader>
    </>
  );
}
