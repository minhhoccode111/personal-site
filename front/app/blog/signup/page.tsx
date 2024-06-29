"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { z } from "zod";

import SectionHeader from "@/components/section-header";
import * as constants from "@/shared/constants";
import useAuthStore from "@/stores/auth";
import { SignupFormSchema } from "@/shared/schema";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

export default function Page() {
  const { setAuthData } = useAuthStore();

  const form = useForm<z.infer<typeof SignupFormSchema>>({
    resolver: zodResolver(SignupFormSchema),

    defaultValues: {
      user: {
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
      },
    },
  });

  const [responseMessage, setResponseMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (values: z.infer<typeof SignupFormSchema>) => {
    setIsLoading(true);

    try {
      const { data } = await axios({
        url: constants.ApiUrl + "/users",
        method: "post",
        data: values,
      });

      console.log(`response data belike: `, data);

      setAuthData(data);

      router.push("/blog");
    } catch (err: any) {
      console.log(`error signup: `, err);

      const message =
        err.response?.data?.errors?.body ||
        "Cannot signup right now please try again";

      setIsLoading(false);

      setResponseMessage(message);
    }
  };
  return (
    <div className="">
      <SectionHeader>signup</SectionHeader>

      <div className="space-y-4">
        {/* normal signup */}

        <div className="">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSignup)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="user.username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>username</FormLabel>

                    <FormControl>
                      <Input disabled={isLoading} type="text" {...field} />
                    </FormControl>

                    {/* <FormDescription>input your username, must be unique</FormDescription> */}

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="user.email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>email</FormLabel>

                    <FormControl>
                      <Input disabled={isLoading} type="email" {...field} />
                    </FormControl>

                    {/* <FormDescription>input your email, must be unique</FormDescription> */}

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
                      <Input disabled={isLoading} type="password" {...field} />
                    </FormControl>

                    {/* <FormDescription>input your password, must be strong</FormDescription> */}

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="user.confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>confirm password</FormLabel>

                    <FormControl>
                      <Input disabled={isLoading} type="password" {...field} />
                    </FormControl>

                    {/* <FormDescription>input your confirm password, must match password</FormDescription> */}

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2 items-center justify-end">
                <Button
                  disabled={isLoading}
                  type="button"
                  variant={"destructive"}
                  onClick={() => form.reset()}
                >
                  Clear
                </Button>

                <Button disabled={isLoading} type="submit">
                  Sign Up
                </Button>
              </div>
            </form>
          </Form>
        </div>

        <div className="">
          <p className="">Or</p>
        </div>

        {/* Google Auth */}
        <div className="">
          <a
            href={isLoading ? "#" : constants.ApiUrl + "/auth/login/google"}
            className=""
          >
            Signup with Google
          </a>
        </div>

        <div className="center">
          <p className="font-bold text-danger p-4">
            {isLoading ? "loading..." : responseMessage}
          </p>
        </div>
      </div>
    </div>
  );
}
