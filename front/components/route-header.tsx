export default function RouteHeader({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <header className="">
      <h2 className="">{children}</h2>
    </header>
  );
}
