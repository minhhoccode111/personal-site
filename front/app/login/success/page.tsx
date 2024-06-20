import RouteHeader from "@/components/route-header";
import Link from "next/link";

export default function Page() {
  // TODO: extract query and store in authData

  return (
    <>
      <RouteHeader>Login success</RouteHeader>

      <div className="">
        <Link href={"/"}>Home</Link>
      </div>
    </>
  );
}
