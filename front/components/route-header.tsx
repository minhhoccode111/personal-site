export default function RouteHeader({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <header className="">
      <h2 className="font-extrabold text-xl">{children}</h2>
    </header>
  );
}
