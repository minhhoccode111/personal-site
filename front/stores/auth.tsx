"use client";

import { create } from "zustand";

import { AuthStoreName } from "@/shared/constants";

import { UserResponse } from "@/shared/types";

type AuthData = {
  user?: UserResponse;
};

type StateAuthStore = {
  authData: AuthData;
};

type ActionAuthStore = {
  setAuthData: (data: AuthData) => void;
};

// TODO: turn off console.log in production
const useAuthStore = create<StateAuthStore & ActionAuthStore>((set) => ({
  // can't access localStorage before componentDidMount
  authData: {},
  setAuthData: (data) => {
    console.log(`data being set with setAuthData belike: `, data);
    localStorage.setItem(AuthStoreName, JSON.stringify(data));
    set(() => ({ authData: data }));
  },
}));

export default useAuthStore;
