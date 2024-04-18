import { apiSlice } from "../apiSlice";

const apiWithTag = apiSlice.enhanceEndpoints({addTagTypes: ['Newsletter']});

export const newsletterApi = apiWithTag.injectEndpoints({
    endpoints: (builder) => ({
        getNewsletter: builder.query({
            query: ({perpage ,page}) => ({
                method: 'GET',
                url: `/admin/newsletters?per_page=${perpage}&page=${page}`,
            }),
            providesTags:['Newsletter']
        }),

        getSubscribers: builder.query({
            query: ({perpage ,page}) => ({
                method: 'GET',
                url: `/admin/newsletters/emails?per_page=${perpage}&page=${page}`,
            }),

        }),


        deleteNewsLetter: builder.mutation({
            query: (id) => ({
                method: 'DELETE',
                url: `/admin/newsletters/${id}`,
            }),
            invalidatesTags:['Newsletter']
        }),

        addNewsletter: builder.mutation({
            query: (body) => ({
                method:'POST',
                url:`/admin/newsletters`,
                body
            }),
            invalidatesTags:['Newsletter']
        }),

        sendNewsletter: builder.mutation({
            query: () => ({
                method:'PATCH',
                url:`/admin/newsletters/send`,
            }) ,
            invalidatesTags:['Newsletter']
        }),



    }),


})


export const {
    useGetNewsletterQuery,
    useGetSubscribersQuery,
    useDeleteNewsLetterMutation,
    useAddNewsletterMutation,
    useSendNewsletterMutation

} = newsletterApi