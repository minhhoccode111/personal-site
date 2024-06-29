import Link from "next/link";

export default function Page() {
  return (
    <div className="">
      <header className="">
        <h3>Login with Google failed</h3>
      </header>

      <div className="">
        <Link href={"/blog/login"}>Click here to try login again</Link>
      </div>
    </div>
  );
}
