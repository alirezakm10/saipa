import { apiSlice } from "../apiSlice";

const apiWithTag = apiSlice.enhanceEndpoints({ addTagTypes: ["Profile"] });

export const profileApi = apiWithTag.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => ({
        method: "GET",
        url: `/profile`,
      }),
      providesTags: ["Profile"],
    }),

    updateProfile: builder.mutation({
      query: (body) => ({
        method: "POST",
        url: `/profile`,
        body,
      }),
      invalidatesTags: ["Profile"],
    }),

    updateProfilePhoto: builder.mutation({
      query: (body) => ({
        method: "POST",
        url: `/profile/photo/update`,
        body,
      }),
      invalidatesTags: ["Profile"],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUpdateProfilePhotoMutation,
} = profileApi;
