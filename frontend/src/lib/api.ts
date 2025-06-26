import { hc, InferResponseType } from "hono/client";
import { queryOptions } from "@tanstack/react-query";

import { UserBasicSettingsData } from "@/shared/schemas";
import type { ApiRoutes, ErrorResponse } from "@/shared/types";

import { authClient } from "./auth-client";

export const client = hc<ApiRoutes>("/", {
  fetch: (input: RequestInfo | URL, init?: RequestInit) =>
    fetch(input, {
      ...init,
      credentials: "include",
    }),
}).api;

export const getSession = async () => {
  const res = await authClient.getSession();
  if (res.data?.session) {
    return res.data.session;
  }

  return null;
};

export const getUser = async () => {
  const res = await authClient.getSession();
  if (res.data?.user) {
    return res.data.user;
  }

  return null;
};

export const userQueryOptions = () =>
  queryOptions({
    queryKey: ["user"],
    queryFn: getUser,
    staleTime: Infinity,
  });

export type GetUsersResponse = InferResponseType<typeof client.users.$get>;
export const getUsers = async () => {
  const res = await client.users.$get();

  if (!res.ok) {
    const data = (await res.json()) as unknown as ErrorResponse;
    throw new Error(data.error);
  }
  const data = await res.json();
  return data;
};

export type GetUserLastTestResponse = InferResponseType<
  (typeof client.users)["last-test"]["$get"]
>;
export const getUserLastTest = async () => {
  const res = await client.users["last-test"].$get();

  if (res.ok) {
    const data = await res.json();
    return data;
  } else {
    const data = (await res.json()) as unknown as ErrorResponse;
    throw new Error(data.error);
  }
};

export const updateProfile = async (
  userId: string,
  data: UserBasicSettingsData,
) => {
  const res = await client.users[":id"]["update-profile"].$post({
    param: {
      id: userId,
    },
    form: {
      ...data,
    },
  });

  if (res.ok) {
    const data = await res.json();
    return data;
  } else {
    const data = (await res.json()) as unknown as ErrorResponse;
    throw new Error(data.error);
  }
};
