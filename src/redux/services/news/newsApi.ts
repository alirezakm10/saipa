import { apiSlice } from "../apiSlice";




const apiWithTag = apiSlice.enhanceEndpoints({addTagTypes: ['News','NewsCategory']})

export const newsApi = apiWithTag.injectEndpoints({
    // below endpoint get all categories with children for rendering a treeview list in categoryTab component inside classification
    endpoints: (builder) => ({
        getNew: builder.query({
            query: (id) => ({
                method: 'GET',
                url: `/admin/news/${id}`,
            }),
            providesTags:['News']
        }),

        getNews: builder.query({
            query: ({perpage ,page}) => ({
                method: 'GET',
                url: `/admin/news?per_page=${perpage}&page=${page}`,
            }),
            providesTags:['News']
        }),

        getNewsCategory: builder.query({
            query: (id) => ({
                method: 'GET',
                url: `/admin/classifications/9`,
            }),
            providesTags:['NewsCategory']
        }),

        deleteNew: builder.mutation({
            query: (id) => ({
                method: 'DELETE',
                url: `/admin/news/${id}`,
            }),
            invalidatesTags:['News']
        }),

        updateNew: builder.mutation({
            query: ({id, patch}) => ({
                method:'PUT',
                url:`/admin/news/${id}`,
                body:patch
            }),
            invalidatesTags:['News']
        }),

        addNew: builder.mutation({
            query: ({ patch}) => ({
                method:'POST',
                url:`/admin/news`,
                body:patch
            }), 
            invalidatesTags:['News']
        })

    }),


})


export const {
    useGetNewQuery,
    useGetNewsQuery,
    useGetNewsCategoryQuery,
    useAddNewMutation,
    useUpdateNewMutation,
    useDeleteNewMutation
} = newsApi