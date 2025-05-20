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
  tagTypes: ['Topics', 'Discussions', 'Comments', 'Groups'],
  endpoints: (builder) => ({
    getTopics: builder.query({
      query: () => '/api/community/topics/',
      providesTags: ['Topics'],
    }),
    getDiscussions: builder.query({
      query: (topicId) => `/api/community/discussions/?topic=${topicId}`,
      providesTags: (result, error, topicId) => [
        { type: 'Discussions', id: topicId },
        'Discussions',
      ],
    }),
    getDiscussionComments: builder.query({
      query: (discussionId) => `/api/community/comments/?discussion=${discussionId}`,
      providesTags: (result, error, discussionId) => [        { type: 'Comments', id: discussionId },
        'Comments',
      ],
    }),
    getGroups: builder.query({
      query: () => '/api/community/groups/',
      providesTags: ['Groups'],
    }),
    createDiscussion: builder.mutation({
      query: (discussionData) => ({
        url: '/api/community/discussions/',
        method: 'POST',
        body: discussionData,
      }),
      invalidatesTags: ['Discussions'],
    }),
    createComment: builder.mutation({
      query: (commentData) => ({
        url: '/api/community/comments/',
        method: 'POST',
        body: commentData,
      }),
      invalidatesTags: (result, error, { discussion }) => [
        { type: 'Comments', id: discussion },
        'Comments',
      ],
    }),
  }),
});

export const {
  useGetTopicsQuery,
  useGetDiscussionsQuery,
  useGetDiscussionCommentsQuery,
  useGetGroupsQuery,
  useCreateDiscussionMutation,
  useCreateCommentMutation,
} = communityApi;