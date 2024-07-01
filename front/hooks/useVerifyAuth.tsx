import { UserResponse } from "@/shared/types";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type UseValidateAuthType = {
  checkIsAuthor: boolean;
  user?: UserResponse;
  failureRedirect: string;
};

export default function useValidateAuth({
  user,
  checkIsAuthor = false,
  failureRedirect = "/blog/logout",
}: UseValidateAuthType) {
  const router = useRouter();

  useEffect(() => {
    if (!user) router.replace(failureRedirect);
    else if (checkIsAuthor && !user.isAuthor) router.replace(failureRedirect);
  }, [user, checkIsAuthor, failureRedirect, router]);

  return null;
}
