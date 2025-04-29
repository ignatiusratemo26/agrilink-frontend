import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getAccessToken } from '../../utils/tokenHelpers';

export const profileApi = createApi({
  reducerPath: 'profileApi',
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
  tagTypes: ['Profile', 'FarmerProfile', 'BuyerProfile'],
  endpoints: (builder) => ({
    getUserProfile: builder.query({
      query: () => '/api/accounts/profile/',
      providesTags: ['Profile'],
    }),
    updateUserProfile: builder.mutation({
      query: (profileData) => ({
        url: '/api/accounts/profile/',
        method: 'PATCH',
        body: profileData,
      }),
      invalidatesTags: ['Profile'],
    }),
    getFarmerProfile: builder.query({
      query: () => '/api/accounts/farmer-profile/',
      providesTags: ['FarmerProfile'],
    }),
    updateFarmerProfile: builder.mutation({
      query: (profileData) => ({
        url: '/api/accounts/farmer-profile/',
        method: 'PATCH',
        body: profileData,
      }),
      invalidatesTags: ['FarmerProfile'],
    }),
    getBuyerProfile: builder.query({
      query: () => '/api/accounts/buyer-profile/',
      providesTags: ['BuyerProfile'],
    }),
    updateBuyerProfile: builder.mutation({
      query: (profileData) => ({
        url: '/api/accounts/buyer-profile/',
        method: 'PATCH',
        body: profileData,
      }),
      invalidatesTags: ['BuyerProfile'],
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useGetFarmerProfileQuery,
  useUpdateFarmerProfileMutation,
  useGetBuyerProfileQuery,
  useUpdateBuyerProfileMutation,
} = profileApi;