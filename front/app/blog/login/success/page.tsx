"use client";

import { useSearchParams, useRouter } from "next/navigation";

import useAuthStore from "@/stores/auth";

import { UserResponse } from "@/shared/types";
import { useEffect, useState } from "react";

// extract the URL query then redirect to /about
export default function Page() {
  const setAuthData = useAuthStore((state) => state.setAuthData);
  const params = useSearchParams();
  const router = useRouter();
  const [isNotValid, setIsNotValid] = useState(false);

  const user: UserResponse = {
    bio: "",
    email: "",
    image: "",
    username: "",
    isAuthor: false,
    isGoogleAuth: false,
    token: "",
  };

  for (const key in user) {
    const value = params.get(key);

    // immediately go to /login if any field is missing
    if (!value) {
      setIsNotValid(true);

      break;
    }

    user[key] = value;
  }

  setAuthData({ user });

  // trigger the redirect inside a useEffect hook so that it happens after the
  // component has mounted, rather than during the render
  useEffect(() => {
    if (isNotValid) router.push("/blog/login");
    else router.push("/blog");
  }, [router, isNotValid]);

  return null;
}
