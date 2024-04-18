import { apiSlice } from "../apiSlice";




const apiWithTag = apiSlice.enhanceEndpoints({addTagTypes: ['Returns']})

export const returnApi = apiWithTag.injectEndpoints({
    // below endpoint get all categories with children for rendering a treeview list in categoryTab component inside classification
    endpoints: (builder) => ({
        getReturns: builder.query({
            query: ({perpage ,page}) => ({
                method: 'GET',
                url: `/admin/return_requests?per_page=${perpage}&page=${page}`,
            }),
            providesTags:['Returns']
        }),

        getReturn: builder.query({
            query: (id) => ({
                method: 'GET',
                url: `/admin/return_requests?product_id=${id}`,
            }),
            providesTags:['Returns']
        }),

     
     



        updateReturnStatus: builder.mutation({
            query: ({id,patch}) => ({
                method:'PUT',
                url:`/admin/return_requests/${id}`,
                body:{...patch}
            }),
            invalidatesTags:['Returns']
        }),



    }),


})

export const {
    useGetReturnsQuery,
    useGetReturnQuery,
    useUpdateReturnStatusMutation,
} = returnApi