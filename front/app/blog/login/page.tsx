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

  const handleLogin = async (data: z.infer<typeof LoginFormSchema>) => {
    try {
      const res = await axios({
        url: constants.ApiUrl + "/auth/login",
        method: "post",
        data,
      });

      console.log(res);
    } catch (err: any) {
      console.log(`error login: `, err);

      const message = err.data?.errors.body;
      setResponseMessage(message);
    } finally {
      //
    }
  };

  // handle login like normal, no need for validate
  const handleLoginGuest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const randomNumber = Math.floor(
        Math.random() * constants.NumberGuestUsers,
      );
      const email = randomNumber + constants.GuestUsersEmailPrefix;
      const password = constants.GuestUsersPassword;

      // console.log(`email belike: `, email);
      // console.log(`password belike: `, password);

      const res = await axios({
        url: constants.ApiUrl + "/auth/login",
        method: "post",
        data: {
          user: {
            // NOTE: data structure like this
            email,
            password,
          },
        },
      });
      console.log(res);
    } catch (err: any) {
      console.log(`error login: `, err);
    } finally {
      //
    }
  };

  return (
    <div className="">
      <SectionHeader>login</SectionHeader>

      <div className="flex flex-col gap-2">
        {/* Normal Login */}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-8">
            <FormField
              control={form.control}
              name="user.email"
              // same as using register
              rules={{
                required: "Email is required",
                minLength: {
                  value: 8,
                  message: "Email must be at least 8 characters long",
                },
                maxLength: {
                  value: 100,
                  message: "Email must be at max 100 characters long",
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>email</FormLabel>

                  <FormControl>
                    <Input
                      id="email"
                      type="email"
                      placeholder=""
                      minLength={8}
                      maxLength={100}
                      {...field}
                    />
                  </FormControl>

                  <FormDescription>input your email to login.</FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="user.password"
              // same as using register
              rules={{
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters long",
                },
                maxLength: {
                  value: 32,
                  message: "Password must be at max 32 characters long",
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>password</FormLabel>

                  <FormControl>
                    <Input
                      id="password"
                      type="password"
                      placeholder=""
                      minLength={8}
                      maxLength={32}
                      {...field}
                    />
                  </FormControl>

                  <FormDescription>
                    input your password to login.
                  </FormDescription>

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

        <div className="">
          <p className="">Or</p>
        </div>

        {/* Random Login */}
        <form onSubmit={handleLoginGuest} className="">
          <button type="submit" className="">
            Login as guest
          </button>
        </form>

        <div className="">
          <p className="">Or</p>
        </div>

        {/* Google Auth */}
        <a href="http://localhost:3000/api/auth/login/google" className="">
          Login with Google
        </a>
      </div>

      <div className="center">
        <p className="font-bold text-yellow-500">{responseMessage}</p>
      </div>
    </div>
  );
}
