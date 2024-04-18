import { apiSlice } from "../../apiSlice"




const apiWithTag = apiSlice.enhanceEndpoints({addTagTypes: ['AllTenders','Tender']})

export const tendersApi = apiWithTag.injectEndpoints({
    // below endpoint get all categories with children for rendering a treeview list in categoryTab component inside classification
    endpoints: (builder) => ({
        getAllTenders: builder.query({
            query: () => ({
                method: 'GET',
                url: `/admin/tenders`,
            }),
            providesTags:['AllTenders']
        }),

        getTender: builder.query({
            query: (id) => ({
                method: 'GET',
                url: `/admin/tenders/${id}`,
            }),
            providesTags:['Tender']
        }),


// add sub answer questions
        addTender: builder.mutation({
            query: ({patch}) => ({
                method:'POST',
                url:`/admin/tenders`,
                body:{...patch}
            }),
            invalidatesTags:['AllTenders','Tender']
        }),

        updateTender: builder.mutation({
            query: ({id,patch}) => ({
                method:'PUT',
                url:`/admin/tenders/${id}`,
                body:{...patch}
            }),
            invalidatesTags:['AllTenders','Tender']
        }),

        deleteTender :  builder.mutation({
            query: (id) => ({
                method: 'DELETE',
                url: `/admin/tenders/${id}`,
            }),
            invalidatesTags:['Tender']
        })


    }),


})


export const {
   useGetAllTendersQuery,
   useGetTenderQuery,
   useAddTenderMutation,
   useUpdateTenderMutation,
   useDeleteTenderMutation,
} = tendersApi