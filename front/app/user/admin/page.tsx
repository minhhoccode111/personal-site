"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

// auto matically redirect to /user/admin/contact
const Page = function Page() {
  const router = useRouter();

  // trigger the redirect inside a useEffect hook so that it happens after the
  // component has mounted, rather than during the render
  useEffect(() => {
    router.replace("/contact/add");
  }, [router]);

  return null;
};

export default Page;
