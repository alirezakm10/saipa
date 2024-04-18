import { apiSlice } from "../apiSlice";



type DeleteSpecFromCat = {
    categoryId?: number;
    specificationId?: number;
}

const apiWithTag = apiSlice.enhanceEndpoints({addTagTypes: ['Keywords','PostCategories']})

export const postClassificationApi = apiWithTag.injectEndpoints({
    // below endpoint get all categories with children for rendering a treeview list in categoryTab component inside classification
    endpoints: (builder) => ({
        getPostsCategories: builder.query({
            query: (id) => ({
                method: 'GET',
                url: `/admin/categories/${id}`,
            }),
            providesTags:['PostCategories']
        }),

        getPostsDropdown: builder.query({
            query: () => ({
                method: 'GET',
                url: '/admin/classifications/4'
            }),
            providesTags:['PostCategories']
        }),

        // below endpoint use cases is when we want get single category with id to render each caregory in categoryTab component
        getPostCategory: builder.query({
            query: (id) => ({
                method: 'GET',
                url: `/admin/classifications/${id}/keywords`
            }),
            providesTags:['PostCategories']
        }),

        updatePostCategory: builder.mutation({
            query: (patch) => ({
            method: 'PUT',
            url: `/admin/classifications/${patch.parent_id}?title=${patch.title}`,
        }),
        invalidatesTags:['PostCategories']
        }),

        addPostCategory:builder.mutation({
            query: ({parent_id,title}) => ({
            method: 'POST',
            url: `/admin/classifications/8?title=${title}&parent_id=${parent_id}`,
        }),
        invalidatesTags:['PostCategories']
        }),

        addPostsCategories:builder.mutation({
            query: (patch) => ({
            method: 'POST',
            url: `/admin/classifications/8/group`,
            body:{items:patch}
        }),
        invalidatesTags:['PostCategories']
        }),


        deletePostCategory:builder.mutation({
            query: (patch) => ({
            method: 'DELETE',
            url: `/admin/classifications`,
            body:{...patch}
        }),
        invalidatesTags:['PostCategories']
        }),


        // this endpoint get all the keywords
        getPostKeywordsList : builder.query({
            query :() => ({
                method:'GET',
                url: `/admin/keywords`,
                providesTags  : ['Keywords']
            })
        }),

        getPostCatKeywords: builder.query({
            query : (id) => ({
                method: 'GET',
                url:`/admin/classifications/${id}/keywords`,
            }),
            providesTags  : ['Keywords']
        }),

        updatePostKeyToCat: builder.mutation({
            query: (patch) => ({
                method:'POST',
                url: `/admin/classification_keyword`,
                body: {...patch},
            }),
            invalidatesTags : ['Keywords']
        }),


    }),


})


export const {
    useGetPostsCategoriesQuery,
    useUpdatePostCategoryMutation,
    useAddPostCategoryMutation,
    useAddPostsCategoriesMutation,
    useDeletePostCategoryMutation,
    useGetPostCategoryQuery,
    useGetPostsDropdownQuery,
    useGetPostKeywordsListQuery,
    useGetPostCatKeywordsQuery,
    useUpdatePostKeyToCatMutation
} = postClassificationApi