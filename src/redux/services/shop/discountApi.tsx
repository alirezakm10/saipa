import { apiSlice } from "../apiSlice";




const apiWithTag = apiSlice.enhanceEndpoints({addTagTypes: ['Discounts','Discount']})

export const discountApi = apiWithTag.injectEndpoints({
    // below endpoint get all categories with children for rendering a treeview list in categoryTab component inside classification
    endpoints: (builder) => ({
        getDiscounts: builder.query({
            query: () => ({
                method: 'GET',
                url: `/admin/discount_codes`,
            }),
            providesTags:['Discounts','Discount']
        }),

        getDiscount: builder.query({
            query: (id) => ({
                method: 'GET',
                url: `/admin/discount_codes/${id}`,
            }),
            providesTags:['Discount']
        }),


        addDiscount: builder.mutation({
            query: (patch) => ({
                method:'POST',
                url:`/admin/discount_codes`,
                body:{...patch}
            }),
            invalidatesTags:['Discount']
        }),

        updateDiscount: builder.mutation({
            query: ({id,patch}) => ({
                method:'PUT',
                url:`/admin/discount_codes/${id}`,
                body:{...patch}
            })
        }),

        deleteDiscount:  builder.mutation({
            query: (id) => ({
                method: 'DELETE',
                url: `/admin/discount_codes/${id}`,
            }),
            invalidatesTags:['Discounts']
        }),


    }),


})


export const {
    useGetDiscountsQuery,
    useGetDiscountQuery,
    useDeleteDiscountMutation,
    useAddDiscountMutation,
    useUpdateDiscountMutation,
} = discountApi