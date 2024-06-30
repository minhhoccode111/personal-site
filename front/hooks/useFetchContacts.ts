import { useEffect, useState } from "react";
import * as constants from "@/shared/constants";
import { UserResponse } from "@/shared/types";
import axios from "axios";
import useSWR from "swr";
import useAuthStore from "@/stores/auth";

// TODO: work with this

const fetcher = async (url, token, query) => {
  const res = await axios({
    url,
    method: "get",
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  return res.data;
};

export default function useFetchContacts() {
  const { authData } = useAuthStore();
  const [limit, setLimit] = useState(5);
  const [offset, setOffset] = useState(0);
  const url = constants.ApiUrl + `/contacts`;
  const query = `limit=${limit}&offset=${offset}`;
  const result = useSWR([url, authData.user?.token, query], fetcher);

  console.log(`data belike: `, result.data);

  useEffect(() => {
    //
  }, []);

  return result;
}
