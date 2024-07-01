import Link from "next/link";
import { cn } from "@/lib/utils";

export default function RouteHeader({
  children,
  nav,
}: Readonly<{
  children: string; // only string accepted
  nav?: React.ReactNode;
}>) {
  return (
    <header className={"my-8 flex gap-4 items-center justify-between"}>
      <h2 className="font-extrabold text-xl">
        <Link href={"/" + children}>{children}</Link>
      </h2>

      {/* optional */}
      {nav}
    </header>
  );
}
