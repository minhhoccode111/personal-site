import RouteHeader from "@/components/route-header";
import Link from "next/link";

export default function Page() {
  return (
    <div className="">
      <RouteHeader>Login with Google failed</RouteHeader>

      <div className="">
        <Link href={"/login"}>Click here to try again</Link>
      </div>
    </div>
  );
}
