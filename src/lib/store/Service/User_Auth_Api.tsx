import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userAuthapi = createApi({
  reducerPath: "userAuthapi",
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}` }),
  endpoints: (builder) => ({
    createCourse: builder.mutation({
      query: ({data, accessToken}) => ({
        url: "/api/courses/",
        method: "POST",
        body: data,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      }),
    }), 
    getCourse: builder.query({
      query: ({params, accessToken}) => ({
        url: `/api/courses/${params ? `${params}/` :""}`,
        method: "GET",
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      }),
    }), 
    updateCourse: builder.mutation({
      query: ({slug, value, accessToken, attach, chapters}) => ({
        url: `/api/courses/${slug ? `${slug}/` :""}${attach ? `?attachments=attachments` : ''}${chapters ? `?chapters=chapters` : ''}`,
        method: "PATCH",
        body: value,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      }),
    }),
    deleteAttachment: builder.mutation({
      query: ({id, accessToken}) => ({
        url: `/api/attachment/${id ? `${id}/` : ''}`,
        method: "DELETE",
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      }),      
    }), 
    createCategory: builder.mutation({
      query: ({data, accessToken}) => ({
        url: "/api/category/",
        method: "POST",
        body: data,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      }),
    }), 
    getCategory: builder.query({
      query: ({params, accessToken}) => ({
        url: `/api/category/${params ? `${params}/` :""}`,
        method: "GET",
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      }),
    }), 
    updateCategory: builder.mutation({
      query: ({slug, value, accessToken}) => ({
        url: `/api/category/${slug ? `${slug}/` :""}`,
        method: "PATCH",
        body: value,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      }),
    }), 
    updateChapter: builder.mutation({
      query: ({slug, value, accessToken, normal}) => ({
        url: `/api/chapter/${slug ? `${slug}/` :""}${normal ? `update/?slug=${slug}` : ''}`,
        method: "PATCH",
        body: value,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      }),
    }), 
    getChapter: builder.query({
      query: ({params, accessToken}) => ({
        url: `/api/chapter/${params ? `${params}/` :""}`,
        method: "GET",
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      }),
    }), 
  }),
});

export const {
  useCreateCourseMutation,
  useGetCourseQuery,
  useUpdateCourseMutation,
  useDeleteAttachmentMutation,
  useGetCategoryQuery,
  useUpdateCategoryMutation,
  useUpdateChapterMutation,
  useGetChapterQuery,
} = userAuthapi;
