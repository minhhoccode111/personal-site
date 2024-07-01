"use client";

import useAuthStore from "@/stores/auth";

import ContactForm from "./contact-form";
import ContactAll from "./contact-all";

export default function Page() {
  // pass this down in case of race condition
  const { authData } = useAuthStore();

  const isAuthor = authData.user?.isAuthor;

  return (
    <div className="">
      {/* Display Contact Form */}
      {!isAuthor && <ContactForm user={authData.user} />}

      {/* TODO: Display Contact Messages For Normal User (User sent) */}
      {/* <div className=""><SectionHeader>All Sent Contact Messages</SectionHeader></div> */}

      {/* Display Contact Messages */}
      {isAuthor && <ContactAll user={authData.user} />}
    </div>
  );
}
