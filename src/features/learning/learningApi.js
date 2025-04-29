import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getAccessToken } from '../../utils/tokenHelpers';

export const learningApi = createApi({
  reducerPath: 'learningApi',
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
  tagTypes: ['Courses', 'Lessons'],
  endpoints: (builder) => ({
    getCourses: builder.query({
      query: () => '/api/learning/courses/',
      providesTags: ['Courses'],
    }),
    getCourseById: builder.query({
      query: (id) => `/api/learning/courses/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Courses', id }],
    }),
    getCourseLessons: builder.query({
      query: (courseId) => `/api/learning/courses/${courseId}/lessons/`,
      providesTags: (result, error, courseId) => [
        { type: 'Lessons', id: courseId },
        'Lessons',
      ],
    }),
    enrollInCourse: builder.mutation({
      query: (courseId) => ({
        url: `/api/learning/courses/${courseId}/enroll/`,
        method: 'POST',
      }),
      invalidatesTags: ['Courses'],
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useGetCourseByIdQuery,
  useGetCourseLessonsQuery,
  useEnrollInCourseMutation,
} = learningApi;