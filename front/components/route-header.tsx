import Link from "next/link";
import { cn } from "@/lib/utils";

export default function RouteHeader({
  children,
  nav,
}: Readonly<{
  children: string; // only string accepted
  nav?: React.ReactNode;
}>) {
  // display flex if nav exist
  const headerClasses = nav ? "flex gap-4 items-center justify-between" : "";

  return (
    <header className={cn("my-8", headerClasses)}>
      <h2 className="font-extrabold text-xl">
        <Link href={"/" + children}>{children}</Link>
      </h2>

      {/* optional */}
      {nav}
    </header>
  );
}
