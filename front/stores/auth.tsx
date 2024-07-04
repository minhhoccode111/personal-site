"use client";

import { create } from "zustand";

import { UserAuthStoreName } from "@/shared/constants";

import { UserResponse } from "@/shared/types";

type StateUserAuthStore = {
  userData: UserResponse | undefined;
};

type ActionUserAuthStore = {
  setUserData: (data: UserResponse | undefined) => void;
};

// TODO: turn off console.log in production
const useUserStore = create<StateUserAuthStore & ActionUserAuthStore>(
  (set) => ({
    // can't access localStorage before componentDidMount
    userData: undefined,
    setUserData: (data) => {
      console.log(`token being saved belike: `, data?.token);
      localStorage.setItem(UserAuthStoreName, data?.token || "");
      set(() => ({ userData: data }));
    },
  }),
);

export default useUserStore;
