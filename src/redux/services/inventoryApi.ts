import { apiSlice } from "./apiSlice"




const apiWithTag = apiSlice.enhanceEndpoints({ addTagTypes: ['Products','InventoryLogs'] })

export const inventoryApi = apiWithTag.injectEndpoints({
    // below endpoint get all categories with children for rendering a treeview list in categoryTab component inside classification
    endpoints: (builder) => ({
        getInventoryLogs: builder.query({
            query: ({ perpage, page}) => ({
                method: 'GET',
                url: `/admin/in_out_logs?per_page=${perpage}&page=${page}`,
            }),
            providesTags: ['InventoryLogs']
        }),

        getInventoryTargetLog: builder.query({
            query: (id) => ({
                method: 'GET',
                url: `/admin/in_out_logs/${id}`,
            }),
            providesTags: ['InventoryLogs']
        }),

    
        chargeProduct: builder.mutation({
            query: ({ id, patch }) => ({
                method: 'POST',
                url: `/admin/in_out_logs/${id}/charge`,
                body: { ...patch }
            }),
            invalidatesTags:['Products']
        }),

        dischargeProduct: builder.mutation({
            query: ({ id, patch }) => ({
                method: 'POST',
                url: `/admin/in_out_logs/${id}/discharge`,
                body: { ...patch }
            }),
            invalidatesTags:['Products']
        }),

    }),

})

export const {
    useGetInventoryTargetLogQuery,
    useGetInventoryLogsQuery,
    useChargeProductMutation,
    useDischargeProductMutation,
} = inventoryApi