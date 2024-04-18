import { apiSlice } from "../apiSlice";




const apiWithTag = apiSlice.enhanceEndpoints({addTagTypes: ['visits']})

export const visitLogsApi = apiWithTag.injectEndpoints({
    // below endpoint get all categories with children for rendering a treeview list in categoryTab component inside classification
    endpoints: (builder) => ({
        getPagesVisits: builder.query({
            query: () => ({
                method: 'GET',
                url: `/admin/visits/pages`,
            }),
            providesTags:['visits']
        }),

        getVisits: builder.query({
            query: () => ({
                method: 'GET',
                url: `/admin/visits`,
            }),
            providesTags:['visits']
        }),
    }),


})


export const {
    useGetPagesVisitsQuery,
    useGetVisitsQuery,
} = visitLogsApi