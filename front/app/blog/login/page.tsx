"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { z } from "zod";

import RouteHeader from "@/components/route-header";
import * as constants from "@/shared/constants";
import useAuthStore from "@/stores/auth";

export default function Page() {
  const {
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      user: {
        email: "",
        password: "",
      },
    },
  });

  const [responseMessage, setResponseMessage] = useState("");

  const handleLogin = async (data: {
    user: { email: string; password: string };
  }) => {
    try {
      const res = await axios({
        url: constants.ApiUrl + "/auth/login",
        method: "post",
        data,
      });

      console.log(res);
    } catch (err) {
      console.log(`error login: `, err);
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
    } catch (err) {
      console.log(`error login: `, err);
    } finally {
      //
    }
  };

  return (
    <div className="">
      <header className="">
        <h3 className="">Login</h3>
      </header>

      <div className="flex flex-col gap-12">
        {/* Normal Login */}
        <form onSubmit={handleSubmit(handleLogin)} className="">
          <div className="">
            <label htmlFor="email" className="">
              email
            </label>

            <input
              type="email"
              id="email"
              placeholder=""
              className=""
              {...register("user.email", {
                required: "Email is required",
                minLength: {
                  value: 8,
                  message: "Email must be at least 8 characters long",
                },
                maxLength: {
                  value: 100,
                  message: "Email must be at max 100 characters long",
                },
              })}
            />
          </div>

          <div className="">
            <label htmlFor="password" className="">
              password
            </label>
            <input
              type="password"
              id="password"
              placeholder=""
              className=""
              {...register("user.password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters long",
                },
                maxLength: {
                  value: 32,
                  message: "Password must be at max 32 characters long",
                },
              })}
            />
          </div>

          <div className="">
            <button type="submit" className="">
              Login
            </button>
          </div>
        </form>

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
