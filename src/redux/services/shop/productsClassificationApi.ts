import { apiSlice } from "../apiSlice";



type DeleteSpecFromCat = {
    categoryId?: number;
    specificationId?: number;
}

const apiWithTag = apiSlice.enhanceEndpoints({addTagTypes: ['Keywords','Specifications','Categories','Brands']})

export const productsClassificationApi = apiWithTag.injectEndpoints({
    // below endpoint get all categories with children for rendering a treeview list in categoryTab component inside classification
    endpoints: (builder) => ({
        getCategories: builder.query({
            query: (id) => ({
                method: 'GET',
                url: `/admin/categories/${id}`,
            }),
            providesTags:['Categories'],
        }),

        getDropdown: builder.query({
            query: () => ({
                method: 'GET',
                url: '/admin/classifications/4'
            }),
            providesTags:['Categories']
        }),

        // below endpoint use cases is when we want get single category with id to render each caregory in categoryTab component
        getCategory: builder.query({
            query: (id) => ({
                method: 'GET',
                url: `/admin/classifications/${id}/keywords`
            }),
            providesTags:['Categories']
        }),

        updateCategory: builder.mutation({
            query: (patch) => ({
            method: 'PUT',
            url: `/admin/classifications/${patch.parent_id}?title=${patch.title}`,
        }),
        invalidatesTags:['Categories']
        }),

        addCategory:builder.mutation({
            query: ({parent_id,title}) => ({
            method: 'POST',
            url: `/admin/classifications/4/?title=${title}&parent_id=${parent_id}`,
        }),
        invalidatesTags:['Categories']
        }),

        addCategories:builder.mutation({
            query: (patch) => ({
            method: 'POST',
            url: `/admin/classifications/4/group`,
            body:{items:patch}
        }),
        invalidatesTags:['Categories']
        }),


        deleteCategory:builder.mutation({
            query: (patch) => ({
            method: 'DELETE',
            url: `/admin/classifications`,
            body:{...patch}
        }),
        invalidatesTags:['Categories']
        }),

        // below endpoint use cases is when we want add specifications to a category or edit them
        updateSpecToCat: builder.mutation({
            query: (patch) => ({
                method: 'POST',
                url: `/admin/category-specifications`,
                body: {...patch},
            }),
            invalidatesTags:['Specifications']
        }),

        // this endpoint get all the keywords
        getKeywordsList : builder.query({
            query :() => ({
                method:'GET',
                url: `/admin/keywords`,
                providesTags  : ['Keywords']
            })
        }),

        getCatKeywords: builder.query({
            query : (id) => ({
                method: 'GET',
                url:`/admin/classifications/${id}/keywords`,
            }),
            providesTags  : ['Keywords']
        }),

        updateKeyToCat: builder.mutation({
            query: (patch) => ({
                method:'POST',
                url: `/admin/classification_keyword`,
                body: {...patch},
            }),
            invalidatesTags : ['Keywords']
        }),






        getSpecificationsList : builder.query({
            query: () => ({
                method:'GET',
                url:`/admin/classifications/6`,
            }),
            providesTags: ['Specifications'],
        }),

        deleteSpecifications : builder.mutation({
            query: (patch) => ({
                method:'DELETE',
                url:`/admin/classifications`,
                body:{...patch}
            }),
        invalidatesTags:['Specifications']
        }),


        addSpecification : builder.mutation({
            query: (patch) => ({
                method: 'POST',
                url:`/admin/classifications/6/group`,
                body:{items:patch}
            }),
            invalidatesTags: ['Specifications']
        }),





        // brands api
        getBrandsList : builder.query({
            query: () => ({
                method:'GET',
                url:`/admin/classifications/5`,
            }),
            providesTags: ['Brands'],
        }),

        deleteBrands : builder.mutation({
            query: (patch) => ({
                method:'DELETE',
                url:`/admin/classifications`,
                body:{...patch}
            }),
        invalidatesTags:['Brands']
        }),


        addbrands : builder.mutation({
            query: (patch) => ({
                method: 'POST',
                url:`/admin/classifications/5/group`,
                body:{items:patch}
            }),
            invalidatesTags: ['Brands']
        }),
// end of brands api


    }),

    overrideExisting: false,
})


export const {
    useGetCategoriesQuery,
    useUpdateCategoryMutation,
    useAddCategoriesMutation,
    useAddCategoryMutation,
    useDeleteCategoryMutation,
    useGetCategoryQuery,
    useGetDropdownQuery,
    useUpdateSpecToCatMutation,
    useGetSpecificationsListQuery,
    useDeleteSpecificationsMutation,
    useAddSpecificationMutation,
    useGetKeywordsListQuery,
    useGetCatKeywordsQuery,
    useUpdateKeyToCatMutation,
    useGetBrandsListQuery,
    useDeleteBrandsMutation,
    useAddbrandsMutation,
} = productsClassificationApi