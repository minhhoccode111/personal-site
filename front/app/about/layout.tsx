// NOTE: template of a layout, can use Layout component to create a
// Protect-route-wrapper to redirect to /login if user in authData is Not Found

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
