import { apiSlice } from "../apiSlice";



const apiWithTag = apiSlice.enhanceEndpoints({addTagTypes: ['Keywords','Docs']})

export const docsClassificationApi = apiWithTag.injectEndpoints({
    // below endpoint get all categories with children for rendering a treeview list in categoryTab component inside classification
    endpoints: (builder) => ({
        getDocsCategories: builder.query({
            query: (id) => ({
                method: 'GET',
                url: `/admin/categories/${id}`,
            }),
            providesTags:['Docs']
        
        }),



        // below endpoint use cases is when we want get single category with id to render each caregory in categoryTab component
        getDocCategory: builder.query({
            query: (id) => ({
                method: 'GET',
                url: `/admin/classifications/${id}/keywords`
            }),
            providesTags:['Docs']
        }),

        updateDocsCategory: builder.mutation({
            query: (patch) => ({
            method: 'PUT',
            url: `/admin/classifications/${patch.parent_id}?title=${patch.title}`,
        }),
        invalidatesTags:['Docs']
        }),

        addDocsCategory:builder.mutation({
            query: ({parent_id,title}) => ({
            method: 'POST',
            url: `/admin/classifications/10?title=${title}&parent_id=${parent_id}`,
        }),
        invalidatesTags:['Docs']
        }),

        addDocCategories:builder.mutation({
            query: (patch) => ({
            method: 'POST',
            url: `/admin/classifications/10/group`,
            body:{items:patch}
        }),
        invalidatesTags:['Docs']
        }),


        deleteDocCategory:builder.mutation({
            query: (patch) => ({
            method: 'DELETE',
            url: `/admin/classifications`,
            body:{...patch}
        }),
        invalidatesTags:['Docs']
        }),

    }),

})


export const {
    useGetDocsCategoriesQuery,
    useGetDocCategoryQuery,
    useUpdateDocsCategoryMutation,
    useAddDocCategoriesMutation,
    useAddDocsCategoryMutation,
    useDeleteDocCategoryMutation,
} = docsClassificationApi