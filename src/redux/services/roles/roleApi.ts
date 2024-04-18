import { apiSlice } from "../apiSlice";

const apiWithTag = apiSlice.enhanceEndpoints({
  addTagTypes: ["Role"],
});

export const roleApi = apiWithTag.injectEndpoints({
  endpoints: (builder) => ({
    getRoles: builder.query({
      query: () => ({
        method: "GET",
        url: `/admin/roles`,
      }),
      providesTags: ["Role"],
    }),
    getRole: builder.query({
      query: (id) => ({
        method: "GET",
        url: `/admin/roles/${id}`,
      }),
      providesTags: ["Role"],
    }),
    addRole: builder.mutation({
      query: (body) => ({
        method: "POST",
        url: "/admin/roles",
        body,
      }),
      invalidatesTags: ["Role"],
    }),
    deleteRole: builder.mutation({
      query: (id) => ({
        method: "DELETE",
        url: `/admin/roles/${id}`,
      }),
      invalidatesTags: ["Role"],
    }),

    updateRole: builder.mutation({
      query: ({ id, body }) => ({
        method: "PUT",
        url: `/admin/roles/${id}`,
        body,
      }),
      invalidatesTags: ["Role"],
    }),
  }),
});

export const {
  useGetRolesQuery,
  useGetRoleQuery,
  useAddRoleMutation,
  useDeleteRoleMutation,
  useUpdateRoleMutation,
} = roleApi;
