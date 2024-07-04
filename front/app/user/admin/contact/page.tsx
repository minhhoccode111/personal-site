"use client";
import useAuthStore from "@/stores/auth";

import Loading from "@/components/loading";
import SectionHeader from "@/components/section-header";

import useFetchContacts from "@/hooks/useFetchContacts";

import { useState } from "react";
import { ContactResponse } from "@/shared/types/contact.type";

import * as constants from "@/shared/constants";

// import { useToast } from "@/components/ui/use-toast";

import PaginationData from "@/components/pagination-data";
import ContactMessage from "@/app/user/admin/contact/contact-message";

const PACE = constants.PaginationPace;

export default function Page() {
  // const { toast } = useToast();

  const { authData } = useAuthStore();

  const [limit, setLimit] = useState<number>(PACE);
  const [offset, setOffset] = useState<number>(0);

  const { data, error } = useFetchContacts(limit, offset, authData.user);

  if (error) {
    return (
      <div className="">
        <SectionHeader nav={<span className="">Error</span>}>
          Contact Messages
        </SectionHeader>
        <div className="">
          <p className="">error...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="">
        <SectionHeader nav={<Loading />}>Contact Messages</SectionHeader>
        <div className=""></div>
      </div>
    );
  }

  const { total, contacts } = data;

  return (
    <div className="">
      {/* All Received Contact Messages For Author */}
      <SectionHeader nav={<span className="">Total: {total}</span>}>
        Contact Messages
      </SectionHeader>

      <div className="">
        <ul className="">
          {contacts.map((el: ContactResponse) => (
            <ContactMessage key={el.id} contact={el} />
          ))}
        </ul>
      </div>

      <PaginationData
        total={total}
        limit={limit}
        setLimit={setLimit}
        offset={offset}
        setOffset={setOffset}
      />
    </div>
  );
}
