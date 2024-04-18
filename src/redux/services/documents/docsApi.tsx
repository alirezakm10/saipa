import { apiSlice } from "../apiSlice";




const apiWithTag = apiSlice.enhanceEndpoints({addTagTypes: ['Docs','DocsCategory']})

export const docsApi = apiWithTag.injectEndpoints({
    // below endpoint get all categories with children for rendering a treeview list in categoryTab component inside classification
    endpoints: (builder) => ({
        getDoc: builder.query({
            query: (id) => ({
                method: 'GET',
                url: `/admin/documents/${id}`,
            }),
            providesTags:['Docs']
        }),

        getDocs: builder.query({
            query: ({perpage ,page}) => ({
                method: 'GET',
                url: `/admin/documents?per_page=${perpage}&page=${page}`,
            }),
            providesTags:['Docs']
        }),

        getDocsCategory: builder.query({
            query: (id) => ({
                method: 'GET',
                url: `/admin/classifications/10`,
            }),
            providesTags:['DocsCategory']
        }),

        deleteDoc: builder.mutation({
            query: (id) => ({
                method: 'DELETE',
                url: `/admin/documents/${id}`,
            }),
            invalidatesTags:['Docs']
        }),

        updateDoc: builder.mutation({
            query: ({id, patch}) => ({
                method:'PUT',
                url:`/admin/documents/${id}`,
                body:patch
            }),
            invalidatesTags:['Docs']
        }),

        addDoc: builder.mutation({
            query: ({ patch}) => ({
                method:'POST',
                url:`/admin/documents`,
                body:patch
            }),
            invalidatesTags:['Docs']
        })

    }),


})


export const {
    useGetDocQuery,
    useGetDocsQuery,
    useGetDocsCategoryQuery,
    useAddDocMutation,
    useUpdateDocMutation,
    useDeleteDocMutation
} = docsApi