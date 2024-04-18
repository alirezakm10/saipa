import { apiSlice } from "./apiSlice"




const apiWithTag = apiSlice.enhanceEndpoints({addTagTypes: ['AllFaqs','Faq']})

export const faqApi = apiWithTag.injectEndpoints({
    // below endpoint get all categories with children for rendering a treeview list in categoryTab component inside classification
    endpoints: (builder) => ({
        getAllFaqs: builder.query({
            query: () => ({
                method: 'GET',
                url: `/admin/classifications/7`,
            }),
            providesTags:['AllFaqs']
        }),

        getFaq: builder.query({
            query: (id) => ({
                method: 'GET',
                url: `/admin/faqs/${id}`,
            }),
            providesTags:['Faq']
        }),

        // add parent faq
        addFaqs: builder.mutation({
            query: (patch) => ({
                method:'POST',
                url:`/admin/classifications/7`,
                body:{...patch}
            })
        }),


// add sub answer questions
        addFaq: builder.mutation({
            query: ({id,patch}) => ({
                method:'POST',
                url:`/admin/faqs/${id}`,
                body:{items:patch}
            }),
            invalidatesTags:['AllFaqs','Faq']
        }),

        updateFaqs: builder.mutation({
            query: ({id,patch}) => ({
                method:'PUT',
                url:`/admin/faqs/${id}`,
                body:{...patch}
            }),
            invalidatesTags:['AllFaqs','Faq']
        }),

        deleteFaq :  builder.mutation({
            query: (id) => ({
                method: 'DELETE',
                url: `/admin/faqs/${id}`,
            }),
            invalidatesTags:['Faq']
        }),

        deleteFaqs :  builder.mutation({
            query: (patch) => ({
                method: 'DELETE',
                url: `/admin/classifications`,
                body:{...patch}
            }),
            invalidatesTags:['AllFaqs']
        }),


    }),


})


export const {
    useGetAllFaqsQuery,
    useGetFaqQuery,
    useDeleteFaqMutation,
    useAddFaqMutation,
    useUpdateFaqsMutation,
    useDeleteFaqsMutation,
    useAddFaqsMutation
} = faqApi