"use client";

import { useSearchParams, redirect } from "next/navigation";

import useAuthStore from "@/stores/auth";

import { UserResponse } from "@/shared/types";

// extract the URL query then redirect to /about
export default function Page() {
  const setAuthData = useAuthStore((state) => state.setAuthData);
  const params = useSearchParams();

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
    if (!value) return redirect("/login");

    user[key] = value;
  }

  setAuthData({ user });
  redirect("/about");

  return null;
}
