import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getAccessToken } from '../../utils/tokenHelpers';

export const cropsApi = createApi({
  reducerPath: 'cropsApi',
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
  tagTypes: ['Crops', 'SoilRecords', 'Recommendations'],
  endpoints: (builder) => ({
    getAllCrops: builder.query({
      query: () => '/api/crops/crops/',
      providesTags: ['Crops'],
    }),
    getSoilRecords: builder.query({
      query: () => '/api/crops/soil-records/',
      providesTags: ['SoilRecords'],
    }),
    createSoilRecord: builder.mutation({
      query: (soilData) => ({
        url: '/api/crops/soil-records/',
        method: 'POST',
        body: soilData,
      }),
      invalidatesTags: ['SoilRecords'],
    }),
    getCropRecommendation: builder.mutation({
      query: (soilData) => ({
        url: '/api/crops/recommendations/recommend/',
        method: 'POST',
        body: soilData,
      }),
      invalidatesTags: ['Recommendations'],
    }),
  }),
});

export const {
  useGetAllCropsQuery,
  useGetSoilRecordsQuery,
  useCreateSoilRecordMutation,
  useGetCropRecommendationMutation,
} = cropsApi;