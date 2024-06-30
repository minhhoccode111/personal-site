"use client";

import SectionHeader from "@/components/section-header";
import ContactFormSchema from "@/shared/schema/contact.schema";
import axios from "axios";
import { useState } from "react";
import { z } from "zod";

import * as constants from "@/shared/constants";
import useAuthStore from "@/stores/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Loading from "@/components/loading";
import useFetchContacts from "@/hooks/useFetchContacts";
import { useToast } from "@/components/ui/use-toast";

export default function Page() {
  const { authData } = useAuthStore();

  const [responseMessage, setResponseMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const { data, isLoading, error, setLimit, setOffset } = useFetchContacts(
    authData.user,
  );

  const { toast } = useToast();

  toast({ title: "Testing", description: "Testing description" });

  const form = useForm<z.infer<typeof ContactFormSchema>>({
    resolver: zodResolver(ContactFormSchema),
    defaultValues: {
      contact: {
        name: authData.user?.username || "",
        email: authData.user?.email || "",
        body: "",
      },
    },
  });

  const handleContactSubmit = async (
    contact: z.infer<typeof ContactFormSchema>,
  ) => {
    setIsSending(true);

    try {
      const res = await axios({
        url: constants.ApiUrl + "/contacts",
        method: "post",
        data: contact,
      });

      console.log(`contact message belike: `, res.data);

      setIsSending(false);

      setResponseMessage("Message sent");

      form.reset();
    } catch (err: any) {
      // console.log(`error contact: `, err);

      const message =
        err.response?.data?.errors?.body ||
        "Cannot send contact right now please try again later";

      setIsSending(false);

      setResponseMessage(message);
    }
  };

  return (
    <div className="">
      <SectionHeader>
        Leave a message and I will reach out to you.
      </SectionHeader>

      {/* Section Body */}
      <div className="">
        {/* Contact Form */}
        <div className="">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleContactSubmit)}
              className=""
            >
              <FormField
                control={form.control}
                name="contact.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>fullname</FormLabel>

                    <FormControl>
                      <Input disabled={isSending} type="text" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact.email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>email</FormLabel>

                    <FormControl>
                      <Input disabled={isSending} type="email" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact.body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>message</FormLabel>

                    <FormControl>
                      <Textarea disabled={isSending} {...field}></Textarea>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="">
                <Button
                  disabled={isSending}
                  type="button"
                  variant={"destructive"}
                  onClick={() => form.reset()}
                >
                  Clear
                </Button>

                <Button disabled={isSending} type="submit">
                  Send
                </Button>
              </div>
            </form>
          </Form>
        </div>

        <div className="">
          {isSending ? <Loading /> : <p className="">{responseMessage}</p>}
        </div>

        {/* All Received Contact Messages */}
        {/* Display if user is author */}
        <SectionHeader>All Received Contact Messages</SectionHeader>

        {/* TODO: Your sent Contact Messages */}
        {/* Display if user is logged in */}
        {/* <SectionHeader>All Sent Contact Messages</SectionHeader> */}
      </div>
    </div>
  );
}
