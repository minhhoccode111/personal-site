"use client";

import { useSearchParams, useRouter } from "next/navigation";

import useAuthStore from "@/stores/auth";

import { UserResponse } from "@/shared/types";
import { useEffect, useState } from "react";

import { SuccessRedirect, FailureRedirect } from "@/shared/constants";

// extract the URL query then redirect to /about
export default function Page() {
  const setAuthData = useAuthStore((state) => state.setAuthData);
  const params = useSearchParams();
  const router = useRouter();
  const [isNotValid, setIsNotValid] = useState(false);

  // have to wrap this inside a useEffect because calling setAuthData will
  // interact with localStorage which only available after componentDidMount
  // or else we have a referenceError
  useEffect(() => {
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

      if (key === "isAuthor" || key === "isGoogleAuth")
        user[key] = value === "true";
      else user[key] = value;
    }

    setAuthData({ user });
  }, [params, setAuthData]);

  // trigger the redirect inside a useEffect hook so that it happens after the
  // component has mounted, rather than during the render
  useEffect(() => {
    if (isNotValid) router.replace(FailureRedirect);
    // use replace because we don't want user to hit back to this route
    else router.replace(SuccessRedirect);
  }, [router, isNotValid]);

  return null;
}
