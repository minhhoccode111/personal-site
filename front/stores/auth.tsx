/*
 * This store is used to store user's credential
 * after logged in or retrieve localStorage
 */

import { create } from "zustand";

import { AuthStoreName } from "@/shared/constants";

type StateAuthStore = {
  authData: AuthData;
};

type ActionAuthStore = {
  setAuthData: (data: AuthData) => void;
};

type AuthData = {
  token?: string;
  isLogin?: boolean;
  self?: {
    id: string;
    fullname: string;
  };
};

const useAuthStore = create<StateAuthStore & ActionAuthStore>((set) => {
  const authData =
    localStorage.getItem(AuthStoreName) === null
      ? {}
      : JSON.parse(localStorage.getItem(AuthStoreName) as string);

  return {
    authData,
    setAuthData: (data) => {
      console.log(`the authData is: `, data); // TODO: turn off
      localStorage.setItem(AuthStoreName, JSON.stringify(data));
      set(() => ({ authData: data }));
    },
  };
});

export default useAuthStore;
