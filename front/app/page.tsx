import { redirect } from "next/navigation";

// redirect to /about by default
export default function Home() {
  redirect("/about");
}
