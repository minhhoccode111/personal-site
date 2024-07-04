import { UserResponse } from "@/shared/types";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type UseVerifyAuthType = {
  isAuth?: boolean;
  isAuthz?: boolean;
  user: UserResponse | undefined;
  failureRedirect?: string;
};

import { FailureRedirect } from "@/shared/constants";

export default function useVerifyAuth({
  user,
  isAuth = true,
  isAuthz = false,
  failureRedirect = FailureRedirect,
}: UseVerifyAuthType) {
  const router = useRouter();

  useEffect(() => {
    if (isAuth && !user) router.replace(failureRedirect);
    else if (isAuthz && !user?.isAuthor) router.replace(failureRedirect);
  }, [failureRedirect, isAuth, isAuthz, router, user]);

  return null;
}
