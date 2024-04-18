import { apiSlice } from "../apiSlice";



const apiWithTag = apiSlice.enhanceEndpoints({addTagTypes: ['Keywords','NewsCategories']})

export const newsClassificationApi = apiWithTag.injectEndpoints({
    // below endpoint get all categories with children for rendering a treeview list in categoryTab component inside classification
    endpoints: (builder) => ({
        getNewsCategories: builder.query({
            query: (id) => ({
                method: 'GET',
                url: `/admin/categories/${id}`,
            }),
            providesTags:['NewsCategories']
        }),



        // below endpoint use cases is when we want get single category with id to render each caregory in categoryTab component
        getNewsCategory: builder.query({
            query: (id) => ({
                method: 'GET',
                url: `/admin/classifications/${id}/keywords`
            }),
            providesTags:['NewsCategories']
        }),

        updateNewsCategory: builder.mutation({
            query: (patch) => ({
            method: 'PUT',
            url: `/admin/classifications/${patch.parent_id}?title=${patch.title}`,
        }),
        invalidatesTags:['NewsCategories']
        }),

        addNewsCategory:builder.mutation({
            query: ({parent_id,title}) => ({
            method: 'POST',
            url: `/admin/classifications/9/?title=${title}&parent_id=${parent_id}`,
        }),
        invalidatesTags:['NewsCategories']
        }),

        addNewsCategories:builder.mutation({
            query: (patch) => ({
            method: 'POST',
            url: `/admin/classifications/9/group`,
            body:{items:patch}
        }),
        invalidatesTags:['NewsCategories']
        }),


        deleteNewsCategory:builder.mutation({
            query: (patch) => ({
            method: 'DELETE',
            url: `/admin/classifications`,
            body:{...patch}
        }),
        invalidatesTags:['NewsCategories']
        }),


        // this endpoint get all the keywords
        getNewsKeywordsList : builder.query({
            query :() => ({
                method:'GET',
                url: `/admin/keywords`,
                providesTags  : ['Keywords']
            })
        }),

        getNewsCatKeywords: builder.query({
            query : (id) => ({
                method: 'GET',
                url:`/admin/classifications/${id}/keywords`,
            }),
            providesTags: ['Keywords']
        }),

        updateNewsKeyToCat: builder.mutation({
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
    useGetNewsCategoriesQuery,
    useGetNewsCategoryQuery,
    useUpdateNewsCategoryMutation,
    useAddNewsCategoryMutation,
    useAddNewsCategoriesMutation,
    useDeleteNewsCategoryMutation,
    useGetNewsCatKeywordsQuery,
    useGetNewsKeywordsListQuery,
    useUpdateNewsKeyToCatMutation,
} = newsClassificationApi