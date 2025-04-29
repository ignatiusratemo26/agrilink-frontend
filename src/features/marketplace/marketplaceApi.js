import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getAccessToken } from '../../utils/tokenHelpers';

export const marketplaceApi = createApi({
  reducerPath: 'marketplaceApi',
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
  tagTypes: ['Products', 'Orders'],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => '/api/marketplace/products/',
      providesTags: ['Products'],
    }),
    getProductById: builder.query({
      query: (id) => `/api/marketplace/products/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Products', id }],
    }),
    createProduct: builder.mutation({
      query: (productData) => ({
        url: '/api/marketplace/products/',
        method: 'POST',
        body: productData,
      }),
      invalidatesTags: ['Products'],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...productData }) => ({
        url: `/api/marketplace/products/${id}/`,
        method: 'PATCH',
        body: productData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Products', id },
        'Products',
      ],
    }),
    getOrders: builder.query({
      query: () => '/api/marketplace/orders/',
      providesTags: ['Orders'],
    }),
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: '/api/marketplace/orders/',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: ['Orders'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useGetOrdersQuery,
  useCreateOrderMutation,
} = marketplaceApi;