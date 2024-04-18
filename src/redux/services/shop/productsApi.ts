import { apiSlice } from "../apiSlice";




const apiWithTag = apiSlice.enhanceEndpoints({addTagTypes: ['Products','Product']})

export const productsApi = apiWithTag.injectEndpoints({
    // below endpoint get all categories with children for rendering a treeview list in categoryTab component inside classification
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: ({perpage ,page}) => ({
                method: 'GET',
                url: `/admin/products?per_page=${perpage}&page=${page}`,
            }),
            providesTags:['Products']
        }),

        getProduct: builder.query({
            query: (id) => ({
                method: 'GET',
                url: `/admin/products/${id}`,
            }),
            providesTags:['Product']
        }),


        addProduct: builder.mutation({
            query: (patch) => ({
                method:'POST',
                url:`/admin/products`,
                body:{...patch}
            })
        }),

        updateProduct: builder.mutation({
            query: ({id,patch}) => ({
                method:'PUT',
                url:`/admin/products/${id}`,
                body:patch
            })
        }),

        deleteProduct :  builder.mutation({
            query: (id) => ({
                method: 'DELETE',
                url: `/admin/products/${id}`,
            }),
            invalidatesTags:['Products']
        }),


    }),


})


export const {
    useGetProductsQuery,
    useGetProductQuery,
    useDeleteProductMutation,
    useAddProductMutation,
    useUpdateProductMutation,
} = productsApi