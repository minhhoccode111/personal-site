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
import { LoginFormSchema } from "@/shared/schema";
import Loading from "@/components/loading";

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

export default function Page() {
  const { setAuthData } = useAuthStore();

  const [responseMessage, setResponseMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      user: {
        email: "",
        password: "",
      },
    },
  });

  // TODO: optimize performance useCallback
  const handleLoginSubmit = async (values: z.infer<typeof LoginFormSchema>) => {
    setIsLoading(true);

    try {
      const { data } = await axios({
        url: constants.ApiUrl + "/auth/login",
        method: "post",
        data: values,
      });

      // console.log(`response data belike: `, data);

      setAuthData(data);

      router.replace("/blog");
    } catch (err: any) {
      // console.log(`error login: `, err);

      const message =
        err.response?.data?.errors?.body ||
        "Cannot login right now please try again later";

      setIsLoading(false);

      setResponseMessage(message);
    }
  };

  // handle login like normal, no need for validation
  const handleLoginGuestSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
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

      router.replace("/blog");
    } catch (err: any) {
      // console.log(`error login: `, err);

      const message =
        err.response?.data?.errors?.body ||
        "Cannot login right now please try again later";

      setIsLoading(false);

      setResponseMessage(message);
    }
  };

  return (
    <div className="">
      <SectionHeader>login</SectionHeader>

      {/* Section Body */}
      <div className="">
        {/* normal login form */}
        <div className="">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleLoginSubmit)} className="">
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

              <div className="">
                <Button
                  disabled={isLoading}
                  type="button"
                  variant={"destructive"}
                  onClick={() => form.reset()}
                >
                  Clear
                </Button>

                <Button disabled={isLoading} type="submit">
                  Login
                </Button>
              </div>
            </form>
          </Form>
        </div>

        <div className="">
          <p className="">Or</p>
        </div>

        {/* Random Login */}
        <div className="">
          <form onSubmit={handleLoginGuestSubmit} className="">
            <button disabled={isLoading} type="submit" className="">
              Login as guest
            </button>
          </form>
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
            Login with Google
          </a>
        </div>

        <div className="">
          {isLoading ? <Loading /> : <p className="">{responseMessage}</p>}
        </div>
      </div>
    </div>
  );
}
