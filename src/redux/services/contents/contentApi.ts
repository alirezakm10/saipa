import { apiSlice } from "../apiSlice";




const apiWithTag = apiSlice.enhanceEndpoints({addTagTypes: ['Contents','ContentCategory']})

export const contentApi = apiWithTag.injectEndpoints({
    // below endpoint get all categories with children for rendering a treeview list in categoryTab component inside classification
    endpoints: (builder) => ({
        getContent: builder.query({
            query: (id) => ({
                method: 'GET',
                url: `/admin/contents/${id}`,
            }),
            providesTags:['Contents']
        }),

        getContents: builder.query({
            query: ({perpage ,page}) => ({
                method: 'GET',
                url: `/admin/contents?per_page=${perpage}&page=${page}`,
            }),
            providesTags:['Contents']
        }),

        getContentCategory: builder.query({
            query: (id) => ({
                method: 'GET',
                url: `/admin/classifications/8`,
            }),
            providesTags:['ContentCategory']
        }),

        deleteContent: builder.mutation({
            query: (id) => ({
                method: 'DELETE',
                url: `/admin/contents/${id}`,
            }),
            invalidatesTags:['Contents']
        }),

        updateContent: builder.mutation({
            query: ({id, patch}) => ({
                method:'PUT',
                url:`/admin/contents/${id}`,
                body:patch
            }),
            invalidatesTags:['Contents']
        }),

        addContent: builder.mutation({
            query: ({patch}) => ({
                method:'POST',
                url:`/admin/contents`,
                body:patch
            }),
            invalidatesTags:['Contents']
        })

    }),


})


export const {
    useGetContentQuery,
    useGetContentsQuery,
    useAddContentMutation,
    useGetContentCategoryQuery,
    useUpdateContentMutation,
    useDeleteContentMutation
} = contentApi