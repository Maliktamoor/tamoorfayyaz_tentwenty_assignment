import { api } from "@config/services";
import { apiKey } from "@config/services/baseUrl";

interface SearchMoviesParams {
  query: string;
  page?: number;
}

export const MovieApi = api.injectEndpoints({
  endpoints: (builder) => ({

    getMoviesList: builder.query<any, number | void>({
      query: (page: number) => {
        return {
          url: `3/movie/upcoming?api_key=${apiKey}&page=${page || 1}`,
          method: 'GET',
        };
      },
    }),

    searchMovies: builder.query<any, SearchMoviesParams>({
      query: ({ query }) => {
        return {
          url: `3/search/movie?query=${query}&api_key=${apiKey}`,
          method: 'GET',
        };
      },
    }),

    getGenres: builder.query<any, void>({
      query: () => {
        return {
          url: `3/genre/movie/list?api_key=${apiKey}`,
          method: 'GET',
        };
      },
    }),

    getMovieDetails: builder.query<any, number>({
      query: (movieId) => {
        return {
          url: `3/movie/${movieId}?api_key=${apiKey}`,
          method: 'GET',
        };
      },
    }),

    getMovieImages: builder.query<any, number>({
      query: (movieId) => {
        return {
          url: `3/movie/${movieId}/images?api_key=${apiKey}`,
          method: 'GET',
        };
      },
    }),

    getMovieVideos: builder.query<any, number>({
      query: (movieId) => {
        return {
          url: `3/movie/${movieId}/videos?api_key=${apiKey}`,
          method: 'GET',
        };
      },
    }),

  }),
});

export const {
    useGetMoviesListQuery,
    useSearchMoviesQuery,
    useGetGenresQuery,
    useGetMovieDetailsQuery,
    useGetMovieImagesQuery,
    useGetMovieVideosQuery,
} = MovieApi;
