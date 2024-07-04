"use client";

import axios from "axios";
import useSWR from "swr";
import { ApiUrl, UserAuthStoreName } from "@/shared/constants";
import { useEffect, useState } from "react";
import useUserStore from "@/stores/auth";

const getUserApiUrl = ApiUrl + "/user";

// type UseFetchUserType = {
//   token: string;
// };

const fetcher = (token: string) => (url: string) =>
  axios
    .get(url, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
    .then((res) => res.data);

const useFetchUser = () => {
  const [token, _] = useState(localStorage.getItem(UserAuthStoreName) || "");

  const { setUserData } = useUserStore();

  const { data, error, isLoading } = useSWR(
    token ? getUserApiUrl : "",
    fetcher(token),
  );

  useEffect(() => {
    setUserData(data?.user);
  }, [data?.user, setUserData]);

  console.log(`use fetch user data belike: `, data?.user);

  return { data, error, isLoading };
};

export default useFetchUser;
