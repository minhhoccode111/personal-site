"use client";

import useAuthStore from "@/stores/auth";

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

import { useToast } from "@/components/ui/use-toast";
import ContactFormSchema from "@/shared/schema/contact.schema";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { sleep } from "@/lib/sleep";
import Loading from "@/components/loading";
const sleepTime = 3000;

import * as constants from "@/shared/constants";
import axios from "axios";
import SectionHeader from "@/components/section-header";

export default function Page() {
  // pass this down in case of race condition
  const { authData } = useAuthStore();

  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

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

    toast({
      title: "Sending...",
    });

    try {
      await sleep(sleepTime);

      const res = await axios({
        url: constants.ApiUrl + "/contacts",
        method: "post",
        data: contact,
      });

      console.log(`contact message belike: `, res.data?.contact);

      setIsSending(false);

      toast({
        // TODO: add undo button to delete contact message
        title: "Contact messsage sent.",
      });

      // only reset the contact message body field
      form.setValue("contact.body", "");
    } catch (err: any) {
      // console.log(`error contact: `, err);

      const message =
        err.response?.data?.errors?.body ||
        "Cannot send contact right now please try again later";

      setIsSending(false);

      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="">
      {/* Display Contact Form */}
      <SectionHeader>Leave a message and I will reach out to you</SectionHeader>

      <div className="">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleContactSubmit)} className="">
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

      <div className="">{isSending && <Loading />}</div>
    </div>

    /* TODO: Display all contact messages that current user sent to author */
    /* <div className=""><SectionHeader>All Sent Contact Messages</SectionHeader></div> */
  );
}
