export default function SectionHeader({
  children,
  nav,
}: Readonly<{
  children: string; // only string accepted
  nav?: React.ReactNode;
}>) {
  return (
    <header className={"my-8 flex gap-4 items-center justify-between"}>
      <h3 className="font-extrabold text-lg">{children}</h3>

      {/* optional */}
      {nav}
    </header>
  );
}
