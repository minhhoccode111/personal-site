"use client";

import { redirect } from "next/navigation";
import axios from "axios";
// import swr from 'swr'
import * as constants from "@/shared/constants";

import RouteHeader from "@/components/route-header";

export default function Page() {
  //

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios({
        url: constants.ApiUrl + "/users/login",
        method: "get",
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
      //
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

      const res = await axios({
        url: constants.ApiUrl + "/users/login",
        method: "get",
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
      //
    } finally {
      //
    }
  };

  const handleLoginGoogle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("log in with google");

    try {
      const res = await axios({
        url: constants.ApiUrl + "/users/login/federated/google",
        method: "get",
      });

      console.log(res);
    } catch (err) {
      //
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
        </form>

        <div className="">
          <p className="">or</p>
        </div>

        <form onSubmit={handleLoginGuest} className="">
          <button type="submit" className="">
            Login as guest
          </button>
        </form>

        <div className="">
          <p className="">or</p>
        </div>

        <form onSubmit={handleLoginGoogle} className="">
          <button type="submit">Login with Google</button>
        </form>
      </div>
    </>
  );
}
