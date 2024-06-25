import useAuthStore from "@/stores/auth";
import { useSearchParams, redirect } from "next/navigation";

type UrlObject = {
  [key: string]: string;
};

// extract the URL query then redirect to /about
export default function Page() {
  const setAuthData = useAuthStore((state) => state.setAuthData);

  const user: UrlObject = {};
  useSearchParams().forEach((value, key) => {
    user[key] = value;
  });

  setAuthData(user);

  redirect("/about");
}
