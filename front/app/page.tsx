import Image from "next/image";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Home`,
};

export default function Home() {
  return (
    <main className="flex-1 flex flex-col justify-between p-24">
      <p className="">Home</p>
      <Image
        src="/vercel.svg"
        alt="Vercel Logo"
        className="dark:invert"
        width={100}
        height={24}
        priority
      />
      <Image
        className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
        src="/next.svg"
        alt="Next.js Logo"
        width={180}
        height={37}
        priority
      />
    </main>
  );
}
