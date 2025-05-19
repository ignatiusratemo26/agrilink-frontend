import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export const recommendationsApi = createApi({
  reducerPath: 'recommendationsApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['SoilData', 'Recommendations'],
  endpoints: (builder) => ({
    // Soil records endpoints
    getSoilRecords: builder.query({
      query: () => '/api/crops/soil-records/',
      providesTags: ['SoilData'],
    }),
    getSoilRecordById: builder.query({
      query: (id) => `/api/crops/soil-records/${id}/`,
      providesTags: (result, error, id) => [{ type: 'SoilData', id }],
    }),
    createSoilRecord: builder.mutation({
      query: (data) => ({
        url: '/api/crops/soil-records/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['SoilData'],
    }),
    updateSoilRecord: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/crops/soil-records/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'SoilData', id }],
    }),
    deleteSoilRecord: builder.mutation({
      query: (id) => ({
        url: `/api/crops/soil-records/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SoilData'],
    }),
    
    // Recommendations endpoints
    getRecommendation: builder.mutation({
      query: (data) => ({
        url: '/api/crops/recommendations/recommend/',
        method: 'POST',
        body: data,
      })
    }),
  }),
});

export const {
  useGetSoilRecordsQuery,
  useGetSoilRecordByIdQuery,
  useCreateSoilRecordMutation,
  useUpdateSoilRecordMutation,
  useDeleteSoilRecordMutation,
  useGetRecommendationMutation,
} = recommendationsApi;