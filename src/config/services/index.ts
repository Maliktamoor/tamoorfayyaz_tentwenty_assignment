import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseUrl } from './baseUrl';
import { RootState } from '@config/store';

// Define the API using createApi
export const api = createApi({

  tagTypes: [''],

  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0YTYzMzBkNTc0NjE1NDkyZDQ5NDkwY2EwZWZjOGZlMCIsIm5iZiI6MTc2MTkyOTQwNC4xMDIwMDAyLCJzdWIiOiI2OTA0ZThiY2Q0NjY3NDNhMWNlMTIyMWIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.RqpsXwuS5vkrneI_gToeBPuqpVIu34nZg7_xgUynq7s'
      
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: () => ({}),
});

