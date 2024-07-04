"use client";

import { UserResponse } from "@/shared/types";
import useUserStore from "@/stores/auth";
import { useRouter } from "next/navigation";

type AuthWrapperType = {
  user: UserResponse;
  children: React.ReactNode;
  checkIsAuthor: boolean;
  failureRedirect: string;
};

export default function AuthWrapper({
  user,
  children,
  checkIsAuthor = false,
  failureRedirect = "/blog/logout",
}: AuthWrapperType) {
  const { router } = useRouter();

  return <>{children}</>;
}
