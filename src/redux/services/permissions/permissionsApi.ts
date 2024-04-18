import { apiSlice } from "../apiSlice";

const apiWithTag = apiSlice.enhanceEndpoints({
  addTagTypes: ["permission"],
});

export const permissionsApi = apiWithTag.injectEndpoints({
  endpoints: (builder) => ({
    getPermissions: builder.query({
      query: () => ({
        method: "GET",
        url: `/admin/permissions`,
      }),
      providesTags: ["permission"],
    }),
    addPermissionToRole: builder.mutation({
      query: (body) => ({
        method: "POST",
        url: "/admin/roles/add-permission",
        body,
      }),
      invalidatesTags: ["permission"],
    }),
  }),
});

export const {
useGetPermissionsQuery,
useAddPermissionToRoleMutation,
} = permissionsApi;
