import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getAccessToken } from '../../utils/tokenHelpers';

export const communityApi = createApi({
  reducerPath: 'communityApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    prepareHeaders: (headers) => {
      const token = getAccessToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Forums', 'ForumThreads', 'Comments'],
  endpoints: (builder) => ({
    getForums: builder.query({
      query: () => '/api/community/forums/',
      providesTags: ['Forums'],
    }),
    getForumThreads: builder.query({
      query: (forumId) => `/api/community/forums/${forumId}/threads/`,
      providesTags: (result, error, forumId) => [
        { type: 'ForumThreads', id: forumId },
        'ForumThreads',
      ],
    }),
    getThreadComments: builder.query({
      query: (threadId) => `/api/community/threads/${threadId}/comments/`,
      providesTags: (result, error, threadId) => [
        { type: 'Comments', id: threadId },
        'Comments',
      ],
    }),
    createThread: builder.mutation({
      query: (threadData) => ({
        url: '/api/community/threads/',
        method: 'POST',
        body: threadData,
      }),
      invalidatesTags: ['ForumThreads'],
    }),
    createComment: builder.mutation({
      query: ({ threadId, ...commentData }) => ({
        url: `/api/community/threads/${threadId}/comments/`,
        method: 'POST',
        body: commentData,
      }),
      invalidatesTags: (result, error, { threadId }) => [
        { type: 'Comments', id: threadId },
        'Comments',
      ],
    }),
  }),
});

export const {
  useGetForumsQuery,
  useGetForumThreadsQuery,
  useGetThreadCommentsQuery,
  useCreateThreadMutation,
  useCreateCommentMutation,
} = communityApi;