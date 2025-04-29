import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getAccessToken } from '../../utils/tokenHelpers';

export const messagesApi = createApi({
  reducerPath: 'messagesApi',
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
  tagTypes: ['Messages'],
  endpoints: (builder) => ({
    getMessages: builder.query({
      query: () => '/api/connections/messages/',
      providesTags: ['Messages'],
    }),
    sendMessage: builder.mutation({
      query: (messageData) => ({
        url: '/api/connections/messages/',
        method: 'POST',
        body: messageData,
      }),
      invalidatesTags: ['Messages'],
    }),
  }),
});

export const {
  useGetMessagesQuery,
  useSendMessageMutation,
} = messagesApi;