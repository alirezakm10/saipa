import { apiSlice } from "../apiSlice";

const apiWithTag = apiSlice.enhanceEndpoints({ addTagTypes: ["Address"] });

export const userAddressApi = apiWithTag.injectEndpoints({
  endpoints: (builder) => ({
    getUserAddresses: builder.query({
      query: (id) => ({
        method: "GET",
        url: `/admin/user/${id}/addresses`,
      }),
      providesTags: ["Address"],
    }),

    getUserAddress: builder.query({
      query: (id) => ({
        method: "GET",
        url: `/admin/addresses/${id}`,
      }),
      providesTags: ["Address"],
    }),

    addUserAddress: builder.mutation({
      query: (body ) => ({
        method: "POST",
        url: `/admin/addresses`,
        body
      }),
      invalidatesTags: ["Address"],
    }),

    updateUserAddress: builder.mutation({
      query: ({id , body }) => ({
        method: "PUT",
        url: `/admin/addresses/${id}`,
        body
      }),
      invalidatesTags: ["Address"],
    }),

    deleteUserAddress: builder.mutation({
      query: (id) => ({
        method: "DELETE",
        url: `/admin/addresses/${id}`,
      }),
      invalidatesTags: ["Address"],
    }),

    addDefaultAddress: builder.mutation({
      query: (id) => ({
        method: "PATCH",
        url: `/admin/addresses/${id}/default`,
      }),
      invalidatesTags: ["Address"],
    }),
  }),
});

export const {
  useGetUserAddressesQuery,
  useGetUserAddressQuery,
  useAddDefaultAddressMutation,
  useUpdateUserAddressMutation,
  useDeleteUserAddressMutation,
  useAddUserAddressMutation
} = userAddressApi;
