import { apiSlice } from "../apiSlice";




const apiWithTag = apiSlice.enhanceEndpoints({addTagTypes: ['Transports']})

export const transportApi = apiWithTag.injectEndpoints({
    // below endpoint get all categories with children for rendering a treeview list in categoryTab component inside classification
    endpoints: (builder) => ({
        getTransports: builder.query({
            query: () => ({
                method: 'GET',
                url: `/admin/posts`,
            }),
            providesTags:['Transports']
        }),

        getTransport: builder.query({
            query: (id) => ({
                method: 'GET',
                url: `/admin/posts/${id}`,
            }),
            providesTags:['Transports']
        }),


        addTransport: builder.mutation({
            query: (patch) => ({
                method:'POST',
                url:`/admin/posts`,
                body:{...patch}
            }),
            invalidatesTags:['Transports']
        }),

        updateTransport: builder.mutation({
            query: ({id,patch}) => ({
                method:'PUT',
                url:`/admin/posts/${id}`,
                body:{...patch}
            }),
            invalidatesTags:['Transports'],
        }),

        deleteTransport :  builder.mutation({
            query: (id) => ({
                method: 'DELETE',
                url: `/admin/posts/${id}`,
            }),
            invalidatesTags:['Transports']
        }),


    }),


})


export const {
    useGetTransportsQuery,
    useGetTransportQuery,
    useDeleteTransportMutation,
    useAddTransportMutation,
    useUpdateTransportMutation,
} = transportApi