import { apiSlice } from "../apiSlice";




const apiWithTag = apiSlice.enhanceEndpoints({addTagTypes: ['Orders']})

export const ordersApi = apiWithTag.injectEndpoints({
    // below endpoint get all categories with children for rendering a treeview list in categoryTab component inside classification
    endpoints: (builder) => ({
        getOrders: builder.query({
            query: ({perpage ,page}) => ({
                method: 'GET',
                url: `/admin/orders?per_page=${perpage}&page=${page}`,
            }),
            providesTags:['Orders']
        }),

        getOrder: builder.query({
            query: (id) => ({
                method: 'GET',
                url: `/admin/orders/${id}`,
            }),
            providesTags:['Orders']
        }),

        getUserPurchases: builder.query({
            query: (id) => ({
                method: 'GET',
                url: `/admin/orders/user/${id}`,
            }),
            providesTags:['Orders']
        }),



        updateOrderStatus: builder.mutation({
            query: ({id,patch}) => ({
                method:'PUT',
                url:`/admin/orders/${id}/status`,
                body:{...patch}
            }),
            invalidatesTags:['Orders']
        }),



    }),


})


export const {
    useGetOrdersQuery,
    useGetOrderQuery,
    useUpdateOrderStatusMutation,
    useGetUserPurchasesQuery,
} = ordersApi