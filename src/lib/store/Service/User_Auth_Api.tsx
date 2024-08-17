import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const userAuthapi = createApi({
  reducerPath: "userAuthapi",
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}` }),
  endpoints: (builder) => ({
    createCourse: builder.mutation({
      query: ({data, accessToken}) => ({
        url: "api/courses/",
        method: "POST",
        body: data,
        headers: accessToken,
      }),
    }), 
  }),
});

export const {
  useCreateCourseMutation,
} = userAuthapi;
