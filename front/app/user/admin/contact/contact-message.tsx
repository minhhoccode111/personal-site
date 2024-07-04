import formatDate from "@/lib/formatDate";
import { ContactResponse } from "@/shared/types/contact.type";

export default function ContactMessage({
  contact,
}: {
  contact: ContactResponse;
}) {
  return (
    <li key={contact.id} className="">
      <p className="">{contact.name}</p>
      <p className="">{contact.email}</p>
      <p className="">{contact.body}</p>
      <p className="">{formatDate(contact.createdAt)}</p>
    </li>
  );
}
