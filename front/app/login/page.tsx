"use client";

import { redirect } from "next/navigation";
import axios from "axios";
// import swr from 'swr'

import RouteHeader from "@/components/route-header";
import * as constants from "@/shared/constants";
import useAuthStore from "@/stores/auth";

export default function Page() {
  //

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios({
        url: constants.ApiUrl + "/auth/login",
        method: "post",
        data: {
          // WARN: note that data must be structure like this
          // user: {
          // username,
          // password,
          // }
        },
      });
      console.log(res);
    } catch (err) {
      console.log(`error login: `, err);
    } finally {
      //
    }
  };

  const handleLoginGuest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const randomNumber = Math.floor(
        Math.random() * constants.NumberGuestUsers,
      );
      const email = randomNumber + constants.GuestUsersEmailPrefix;
      const password = constants.GuestUsersPassword;

      console.log(`email belike: `, email);
      console.log(`password belike: `, password);

      const res = await axios({
        url: constants.ApiUrl + "/auth/login",
        method: "post",
        data: {
          // WARN: note that data must be structure like this
          user: {
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
    <>
      <RouteHeader>Login</RouteHeader>

      <div className="">
        <form onSubmit={handleLogin} className="">
          <label htmlFor="" className="">
            username
          </label>
          <input type="text" className="" />

          <label htmlFor="" className="">
            password
          </label>
          <input type="text" className="" />

          <button type="submit" className="">
            Login
          </button>
        </form>

        <div className="">
          <p className="">Or</p>
        </div>

        <form onSubmit={handleLoginGuest} className="">
          <button type="submit" className="">
            Login as guest
          </button>
        </form>

        <div className="">
          <p className="">Or</p>
        </div>

        {/*<form onSubmit={handleLoginGoogle} className="">
          <button type="submit">Login with Google</button>
        </form>*/}
        <a href="http://localhost:3000/api/auth/login/google" className="">
          Login with Google
        </a>
      </div>
    </>
  );
}
