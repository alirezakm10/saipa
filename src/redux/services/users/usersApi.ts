import { apiSlice } from "../apiSlice";

const apiWithTag = apiSlice.enhanceEndpoints({ addTagTypes: ["Users", "UsersSignIns"] });

export const usersApi = apiWithTag.injectEndpoints({
  endpoints: (builder) => ({
    getUsersSignIns: builder.query({
      query: ({ perpage, page }) => ({
        method: "GET",
        url: `/admin/users/sign-ins?per_page=${perpage}&page=${page}`,
      }),
      providesTags: ["UsersSignIns"],
    }),

    getSingleUserSignIns:  builder.query({
      query: (id) => ({
        method: "GET",
        url: `/admin/users/${id}/sign-ins`,
      }),
      providesTags: ["UsersSignIns"],
    }),




    getUser: builder.query({
      query: (id) => ({
        method: "GET",
        url: `/admin/users/${id}`,
      }),
      providesTags: ["Users"],
    }),

    getUsers: builder.query({
      query: ({ perpage, page , name , family , email , mobile , is_admin }) => {
        let url = `/admin/users?per_page=${perpage}&page=${page}`;
        if (name) {
          url += `&name=${name}`;
        }
        if(family){
          url += `&family=${family}`;
        }
        if(email){
          url += `&email=${email}`;
        }
        if(mobile){
          url += `&mobile=${mobile}`;
        }
        if(is_admin == 0 || is_admin == 1){
          url += `&is_admin=${is_admin}`;
        }
        return { url, method: 'GET' };
      },
      providesTags: ["Users"],
    }),

    searchUser : builder.query({
      query: (query) => ({
        method: "GET",
        url: `/admin/users/search?query=${query}`
      })
    }),

    addUser: builder.mutation({
      query: (body) => ({
        method: "POST",
        url: "/admin/users",
        body,
      }),
      invalidatesTags: ["Users"],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        method: "DELETE",
        url: `/admin/users/${id}`,
      }),
      invalidatesTags: ["Users"],
    }),
    updateUser: builder.mutation({
      query: ({ id, body }) => ({
        method: "PUT",
        url: `/admin/users/${id}`,
        body,
      }),
      invalidatesTags: ["Users"],
    }),
    assignRoleToUser: builder.mutation({
      query: (body) => ({
        method : "POST" ,
        url : "/admin/user/roles",
        body
      }),
      invalidatesTags: ["Users"],
    })
  }),
});

export const {
  useGetUserQuery,
  useGetUsersQuery,
  useSearchUserQuery,
  useAddUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useGetUsersSignInsQuery,
  useGetSingleUserSignInsQuery,
  useAssignRoleToUserMutation
} = usersApi;
