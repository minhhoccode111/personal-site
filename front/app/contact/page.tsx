"use client";

import SectionHeader from "@/components/section-header";

import useAuthStore from "@/stores/auth";

import useFetchContacts from "@/hooks/useFetchContacts";
import ContactForm from "./contact-form";
import Loading from "@/components/loading";

export default function Page() {
  const { authData } = useAuthStore();

  const { data, error, isLoading } = useFetchContacts(authData.user);

  const isAuthor = authData.user?.isAuthor;

  return (
    <div className="">
      {/* Display Contact Form */}
      {!isAuthor && <ContactForm />}

      {/* TODO: Display Contact Messages For Normal User (User sent) */}
      {/* <div className=""><SectionHeader>All Sent Contact Messages</SectionHeader></div> */}

      {/* Display Contact Messages */}
      {/* TODO: split this to another file */}
      <div className="">
        {/* All Received Contact Messages For Author */}
        <SectionHeader>Contact Messages</SectionHeader>
        <div className=""></div>

        <div className="">{isLoading && <Loading />}</div>
      </div>
    </div>
  );
}
