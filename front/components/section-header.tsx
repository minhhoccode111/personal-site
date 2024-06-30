export default function SectionHeader({
  children,
}: Readonly<{
  children: string; // only string accepted
}>) {
  return (
    <header className={""}>
      <h3 className="text-lg">{children}</h3>
    </header>
  );
}
