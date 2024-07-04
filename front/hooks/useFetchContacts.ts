import * as constants from "@/shared/constants";
import { UserResponse } from "@/shared/types";
import axios from "axios";
import useSWR from "swr";

const fetcher = (token?: string) => (url: string) =>
  axios
    .get(url, { headers: { Authorization: `Token ${token}` } })
    .then((res) => res.data);

export default function useFetchContacts(
  limit: number,
  offset: number,
  user?: UserResponse,
) {
  const url = constants.ApiUrl + `/contacts?limit=${limit}&offset=${offset}`;

  const result = useSWR(user ? url : "", fetcher(user?.token), {
    shouldRetryOnError: false,
  });

  console.log(`contact data belike: `, result.data);

  return result;
}
