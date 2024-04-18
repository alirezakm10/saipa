import { apiSlice } from "../apiSlice";




const apiWithTag = apiSlice.enhanceEndpoints({ addTagTypes: ['Comments', 'Comment'] })

export const commentsApi = apiWithTag.injectEndpoints({
    // below endpoint get all categories with children for rendering a treeview list in categoryTab component inside classification
    endpoints: (builder) => ({
        getComments: builder.query({
            query: ({subject, perpage, page}) => ({
                method: 'GET',
                url: `/admin/comments/${subject}?per_page=${perpage}&page=${page}`,
            }),
            providesTags: ['Comments']
        }),

        getComment: builder.query({
            query: (id) => ({
                method: 'GET',
                url: `/admin/comments/${id}`,
            }),
            providesTags: ['Comments']
        }),


        addComment: builder.mutation({
            query: (patch) => ({
                method: 'POST',
                url: `/admin/comments`,
                body: { ...patch }
            }),
            invalidatesTags:['Comments']
        }),

        updateComment: builder.mutation({
            query: ({ id, patch }) => ({
                method: 'PUT',
                url: `/admin/comments/${id}`,
                body: { ...patch }
            }),
            invalidatesTags:['Comments']
        }),

        deleteComment: builder.mutation({
            query: (id) => ({
                method: 'DELETE',
                url: `/admin/comments/${id}`,
            }),
            invalidatesTags: ['Comments']
        }),

        confirmComment: builder.mutation({
            query: ({ id, patch }) => ({
                method: 'PATCH',
                url: `/admin/comments/${id}/confirm`,
                body: { ...patch }
            }),
            invalidatesTags: ['Comments']
        }),

        rejectComment: builder.mutation({
            query: ({ id, patch }) => ({
                method: 'PATCH',
                url: `/admin/comments/${id}/reject`,
                body: { ...patch }
            }),
            invalidatesTags: ['Comments']
        }),

    }),

})

export const {
    useGetCommentQuery,
    useGetCommentsQuery,
    useAddCommentMutation,
    useUpdateCommentMutation,
    useDeleteCommentMutation,
    useConfirmCommentMutation,
    useRejectCommentMutation,
} = commentsApi