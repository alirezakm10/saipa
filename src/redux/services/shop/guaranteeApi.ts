import { apiSlice } from "../apiSlice";




const apiWithTag = apiSlice.enhanceEndpoints({addTagTypes: ['Guaranties']})

export const guaranteeApi = apiWithTag.injectEndpoints({
    // below endpoint get all categories with children for rendering a treeview list in categoryTab component inside classification
    endpoints: (builder) => ({
        getGuaranties: builder.query({
            query: () => ({
                method: 'GET',
                url: `/admin/guarantees`,
            }),
            providesTags:['Guaranties']
        }),

        getGuarantee: builder.query({
            query: (id) => ({
                method: 'GET',
                url: `/admin/guarantees/${id}`,
            }),
            providesTags:['Guaranties']
        }),


        addGuarantee: builder.mutation({
            query: (patch) => ({
                method:'POST',
                url:`/admin/guarantees`,
                body:{...patch}
            }),
            invalidatesTags:['Guaranties']
        }),

        updateGuarantee: builder.mutation({
            query: ({id,patch}) => ({
                method:'PUT',
                url:`/admin/guarantees/${id}`,
                body:{...patch}
            }),
            invalidatesTags:['Guaranties','Guaranties']
        }),

        deleteGuarantee :  builder.mutation({
            query: (id) => ({
                method: 'DELETE',
                url: `/admin/guarantees/${id}`,
            }),
            invalidatesTags:['Guaranties']
        }),


    }),


})


export const {
    useGetGuarantiesQuery,
    useGetGuaranteeQuery,
    useDeleteGuaranteeMutation,
    useAddGuaranteeMutation,
    useUpdateGuaranteeMutation,
} = guaranteeApi