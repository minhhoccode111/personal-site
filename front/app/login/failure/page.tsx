import RouteHeader from "@/components/route-header";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <RouteHeader>Login fail</RouteHeader>

      <div className="">
        <Link href={"/login"}>Try again</Link>
      </div>
    </>
  );
}
