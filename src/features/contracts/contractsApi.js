import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getAccessToken } from '../../utils/tokenHelpers';

export const contractsApi = createApi({
  reducerPath: 'contractsApi',
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
  tagTypes: ['ContractRequests', 'FarmerOffers'],
  endpoints: (builder) => ({
    getContractRequests: builder.query({
      query: () => '/api/connections/contract-requests/',
      providesTags: ['ContractRequests'],
    }),
    createContractRequest: builder.mutation({
      query: (contractData) => ({
        url: '/api/connections/contract-requests/',
        method: 'POST',
        body: contractData,
      }),
      invalidatesTags: ['ContractRequests'],
    }),
    getFarmerOffers: builder.query({
      query: () => '/api/connections/farmer-offers/',
      providesTags: ['FarmerOffers'],
    }),
    createFarmerOffer: builder.mutation({
      query: (offerData) => ({
        url: '/api/connections/farmer-offers/',
        method: 'POST',
        body: offerData,
      }),
      invalidatesTags: ['FarmerOffers'],
    }),
  }),
});

export const {
  useGetContractRequestsQuery,
  useCreateContractRequestMutation,
  useGetFarmerOffersQuery,
  useCreateFarmerOfferMutation,
} = contractsApi;