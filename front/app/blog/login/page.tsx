"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { z } from "zod";

import SectionHeader from "@/components/section-header";
import * as constants from "@/shared/constants";
import useAuthStore from "@/stores/auth";
import { LoginFormSchema } from "@/shared/schema";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function Page() {
  const { setAuthData } = useAuthStore();

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      user: {
        email: "",
        password: "",
      },
    },
  });

  const [responseMessage, setResponseMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (values: z.infer<typeof LoginFormSchema>) => {
    setIsLoading(true);
    try {
      const { data } = await axios({
        url: constants.ApiUrl + "/auth/login",
        method: "post",
        data: values,
      });

      // console.log(`response data belike: `, data);

      setAuthData(data);

      redirect("/blog");
    } catch (err: any) {
      // console.log(`error login: `, err);

      const message =
        err.response?.data?.errors?.body ||
        "Cannot login right now please try again later";

      setResponseMessage(message);

      setIsLoading(false);
    }
  };

  // handle login like normal, no need for validation
  const handleLoginGuest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const randomNumber = Math.floor(
        Math.random() * constants.NumberGuestUsers,
      );

      const email = randomNumber + constants.GuestUsersEmailPrefix;
      const password = constants.GuestUsersPassword;

      const { data } = await axios({
        url: constants.ApiUrl + "/auth/login",
        method: "post",
        data: {
          user: {
            email,
            password,
          },
        },
      });

      // console.log(`response data belike: `, data);

      setAuthData(data);

      redirect("/blog");
    } catch (err: any) {
      // console.log(`error login: `, err);

      const message =
        err.response?.data?.errors?.body ||
        "Cannot login right now please try again later";

      setResponseMessage(message);

      setIsLoading(false);
    }
  };

  return (
    <div className="">
      <SectionHeader>login</SectionHeader>

      <div className="flex flex-col gap-2">
        {/* Normal Login */}

        <div className="">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleLogin)}
              className="space-y-8"
            >
              <FormField
                control={form.control}
                name="user.email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>email</FormLabel>

                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>

                    {/* <FormDescription>input your email to login.</FormDescription> */}

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="user.password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>password</FormLabel>

                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>

                    {/* <FormDescription>
                    input your password to login.
                  </FormDescription> */}

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2 items-center justify-end">
                <Button
                  type="button"
                  variant={"destructive"}
                  onClick={() => form.reset()}
                >
                  Clear
                </Button>

                <Button type="submit">Submit</Button>
              </div>
            </form>
          </Form>
        </div>

        <div className="">
          <p className="">Or</p>
        </div>

        {/* Random Login */}
        <div className="">
          <form onSubmit={handleLoginGuest} className="">
            <button type="submit" className="">
              Login as guest
            </button>
          </form>
        </div>

        <div className="">
          <p className="">Or</p>
        </div>

        {/* Google Auth */}
        <div className="">
          <a href="http://localhost:3000/api/auth/login/google" className="">
            Login with Google
          </a>
        </div>

        <div className="center">
          <p className="font-bold text-danger-500">{responseMessage}</p>
        </div>
      </div>
    </div>
  );
}
