import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface VideoUrlResponse {
  video_url: string;
}

const buildQueryParams = (params: Record<string, string | number | undefined>) => {
  const queryParams = Object.entries(params)
  .filter(([_, value]) => value !== undefined && value !== null && value !== "")
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  return queryParams ? `?${queryParams}` : "";
};

export const userAuthapi = createApi({
  reducerPath: "userAuthapi",
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}` }),
  endpoints: (builder) => ({
    allUsers: builder.query({
      query: ({accessToken, username, search, rowsperpage, page, exclude_by}) => ({
        url: `api/accounts/admin-users/${username ? `by-username/${username}/` : ""}${buildQueryParams({ search, page_size: rowsperpage, page, exclude_by })}`,
        method: "GET",
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      }),
    }),  
    getUserViewCourseList: builder.query({
      query: ({ accessToken,slug, search, rowsperpage, page, exclude_by}) => {
        const headers = accessToken ? { authorization: `Bearer ${accessToken}` } : {};
        return {
          url: `/api/course/${slug ? `${slug}/` : ""}${buildQueryParams({ search, page_size: rowsperpage, page, exclude_by })}`,
          method: "GET",
          headers
        }
      },
    }),
    getUserViewChapter: builder.query({
      query: ({ accessToken, chapter_slug}) => {
        const headers = accessToken ? { authorization: `Bearer ${accessToken}` } : {};
        return {
          url: `/api/course/chapter/${chapter_slug ? `${chapter_slug}/` : ""}`,
          method: "GET",
          headers
        }
      },
    }),
    getCourseList: builder.query({
      query: ({ accessToken, search, rowsperpage, page, exclude_by}) => ({
        url: `/api/courses/${buildQueryParams({ search, page_size: rowsperpage, page, exclude_by })}`,
        method: "GET",
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      }),
    }),
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
    deleteCourse: builder.mutation({
      query: ({slug, accessToken}) => ({
        url: `/api/courses/${slug ? `${slug}/` :""}`,
        method: "DELETE",
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
    postChapterAttachemnt:builder.mutation({
      query:({value, accessToken, slug}) =>({
        url:`api/chapter/${slug ? `${slug}` : ""}/attachment/`,
        method: "POST",
        body: value,
        headers:{
          authorization: `Bearer ${accessToken}`,
        }
      })
    }),    
    deleteChapterAttachemnt:builder.mutation({
      query:({value, accessToken, slug, id}) =>({
        url:`api/chapter/${slug ? `${slug}` : ""}/attachment/${id ? `?id=${id}` : ""}`,
        method: "DELETE",
        body: value,
        headers:{
          authorization: `Bearer ${accessToken}`,
        }
      })
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
    videoUploader: builder.mutation({
      query: ({params, value, accessToken}) => ({
        url: `/api/chapters/${params ? `${params}/` :""}/upload-video/`,
        method: "POST",
        body: value,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      }),
    }), 
    getEncryptedVideoUrl: builder.mutation({
      query: ({ slug, accessToken }) => ({
        url: `/api/chapters/${slug}/video/`,
        method: "GET",
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      }),
      transformResponse: (response: VideoUrlResponse) => {
        const videoUrl = response.video_url;
        const encryptedUrl = btoa(videoUrl); 
        return { encryptedUrl };
      },
    }),
    getVideoUrl: builder.query({ 
      query: ({ slug, accessToken }) => ({
        url: `/api/chapters/${slug}/video/`,
        method: "GET",
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      }),
      transformResponse: (response: VideoUrlResponse) => {
        const videoUrl = response.video_url;
        const encryptedUrl = btoa(videoUrl); 
        return { encryptedUrl };
      },
    }),
    deleteChapter: builder.mutation({
      query: ({slug, accessToken}) => ({
        url: `/api/chapter/${slug ? `${slug}/` :""}`,
        method: "DELETE",
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      }),
    }), 
  }),
});

export const {
  useAllUsersQuery,
  useGetUserViewCourseListQuery,
  useGetUserViewChapterQuery,
  useGetCourseListQuery,
  useCreateCourseMutation,
  useGetCourseQuery,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useDeleteAttachmentMutation,
  useGetCategoryQuery,
  useUpdateCategoryMutation,
  useUpdateChapterMutation,
  usePostChapterAttachemntMutation,
  useDeleteChapterAttachemntMutation,
  useGetChapterQuery,
  useVideoUploaderMutation,
  useGetEncryptedVideoUrlMutation,
  useGetVideoUrlQuery,
  useDeleteChapterMutation,
} = userAuthapi;
