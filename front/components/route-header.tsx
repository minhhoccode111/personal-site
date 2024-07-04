import Link from "next/link";

type RouteHeaderType = {
  children: string; // only string accepted
  nav?: React.ReactNode;
  isHeaderLink?: boolean;
};

export default function RouteHeader({
  children,
  nav,
  isHeaderLink = false,
}: Readonly<RouteHeaderType>) {
  return (
    <header className={"my-8 flex gap-4 items-center justify-between"}>
      <h2 className="font-extrabold text-xl">
        {isHeaderLink ? (
          <Link href={"/" + children}>{children}</Link>
        ) : (
          children
        )}
      </h2>

      {/* optional */}
      {nav}
    </header>
  );
}
