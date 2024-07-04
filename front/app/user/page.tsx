"use client";

import useVerifyAuth from "@/hooks/useVerifyAuth";
import useAuthStore from "@/stores/auth";

// NOTE: header already in layout, need layout because this route have sub-route
const Page = function Page() {
  const { authData } = useAuthStore();

  // NOTE: auto redirect to /user/login
  const _ = useVerifyAuth({ user: authData.user });

  return <div className="">This is user profile</div>;
};

export default Page;
