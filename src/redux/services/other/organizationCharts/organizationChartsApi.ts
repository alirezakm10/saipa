import { apiSlice } from "../../apiSlice"




const apiWithTag = apiSlice.enhanceEndpoints({addTagTypes: ['OrganizationChart']})

export const organizationChartsApi = apiWithTag.injectEndpoints({
    // below endpoint get all categories with children for rendering a treeview list in categoryTab component inside classification
    endpoints: (builder) => ({

        getChart: builder.query({
            query: () => ({
                method: 'GET',
                url: `/admin/chart`,
            }),
            providesTags:['OrganizationChart']
        }),


// add sub answer questions
        addChart: builder.mutation({
            query: (patch) => ({
                method:'POST',
                url:`/admin/chart`,
                body:patch
            }),
            invalidatesTags:['OrganizationChart']
        }),



    }),


})


export const {
useGetChartQuery,
useAddChartMutation,
} = organizationChartsApi