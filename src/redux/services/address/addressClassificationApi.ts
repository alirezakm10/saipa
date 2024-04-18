import { apiSlice } from "../apiSlice";

const apiWithTag = apiSlice.enhanceEndpoints({ addTagTypes: ["province"] });

export const addressClassificationApi = apiWithTag.injectEndpoints({
    endpoints: (builder) => ({
      getProvinces: builder.query({
        query: () => ({
          method: "GET",
          url: `/admin/classifications/2`,
        }),
        // providesTags: ["province"],
      }),

      getCities: builder.query({
        query: (id) => ({
          method: "GET",
          url: `/admin/classifications/children/${id}`,
        }),
        // providesTags: ["province"],
      }),
  
    }),
  });

  export const {
    useGetProvincesQuery,
    useGetCitiesQuery,
  } = addressClassificationApi;