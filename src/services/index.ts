import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseUrl } from './baseUrl';
import { RootState } from '../store';

// Define the API using createApi
export const api = createApi({
  tagTypes: [
  ],

  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      // Type the getState function properly
      const state = getState() as RootState;
      return headers;
    },
  }),
  endpoints: () => ({}),
});

