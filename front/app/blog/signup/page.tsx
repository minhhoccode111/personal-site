"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useCallback, useState } from "react";
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
  FormDescription,
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
        password: "",
        username: "",
        confirmPassword: "",
      },
    },
  });

  const [responseMessage, setResponseMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignup = useCallback(
    async (values: z.infer<typeof SignupFormSchema>) => {
      // TODO:
    },
    [],
  );

  return (
    <div className="">
      <SectionHeader>signup</SectionHeader>

      <div className=""></div>
    </div>
  );
}
