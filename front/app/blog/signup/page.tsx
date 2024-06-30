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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import Loading from "@/components/loading";

import { useToast } from "@/components/ui/use-toast";

import { sleep } from "@/lib/sleep";
const sleepTime = 3000;

export default function Page() {
  const { setAuthData } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { toast } = useToast();

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

  const handleSignup = async (values: z.infer<typeof SignupFormSchema>) => {
    setIsLoading(true);

    toast({
      title: "Signing up...",
    });

    try {
      await sleep(sleepTime);

      const { data } = await axios({
        url: constants.ApiUrl + "/users",
        method: "post",
        data: values,
      });

      // console.log(`response data belike: `, data);

      setAuthData(data);

      toast({
        title: "Signup successfully.",
      });

      router.replace("/blog");
    } catch (err: any) {
      console.log(`error signup: `, err);

      const message =
        err.response?.data?.errors?.body ||
        "Cannot signup right now please try again.";

      setIsLoading(false);

      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  };
  return (
    <div className="">
      <SectionHeader>signup</SectionHeader>

      {/* Section Body */}
      <div className="">
        {/* normal signup */}

        <div className="">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSignup)} className="">
              <FormField
                control={form.control}
                name="user.username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>username</FormLabel>

                    <FormControl>
                      <Input disabled={isLoading} type="text" {...field} />
                    </FormControl>

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

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="">
                <Button
                  disabled={isLoading}
                  type="button"
                  variant={"destructive"}
                  onClick={() => {
                    toast({ title: "Form fields clear." });
                    form.reset();
                  }}
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

        <div className="">{isLoading && <Loading />}</div>
      </div>
    </div>
  );
}
