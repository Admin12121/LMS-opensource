import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { auth } from "@/auth";

const createHeaders = async (isAuthRequired = false, contentType: string = "application/json") => {
  const session = await auth();
  const headers: HeadersInit = { "Content-type": contentType };
  if (isAuthRequired) {
    const accessToken = session?.accessToken;
    if (accessToken) {
      headers["authorization"] = `Bearer ${accessToken}`;
    }
  }
  return headers;
};


const baseQuery = async (args: any, api: any, extraOptions: any) => {
  const { url, method, body, isAuthRequired = false } = args;

  const headers = await createHeaders(isAuthRequired);

  const fetchArgs = {
    url,
    method,
    body,
    headers,
  };

  return fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}` })(fetchArgs, api, extraOptions);
};

export const userAuthapi = createApi({
  reducerPath: "userAuthapi",
  baseQuery,
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (user) => ({
        url: "api/accounts/users/",
        method: "POST",
        body: user,
        isAuthRequired: true, // Specify if auth is needed
      }),
    }),
    // Define other endpoints here
  }),
});

export const { useRegisterUserMutation } = userAuthapi;
