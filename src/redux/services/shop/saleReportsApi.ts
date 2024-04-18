import { apiSlice } from "../apiSlice";




const apiWithTag = apiSlice.enhanceEndpoints({addTagTypes: ['SaleReports']})

export const saleReportsApi = apiWithTag.injectEndpoints({
    // below endpoint get all categories with children for rendering a treeview list in categoryTab component inside classification
    endpoints: (builder) => ({
        getSaleReports: builder.query({
            query: ({perpage ,page}) => ({
                method: 'GET',
                url: `/admin/sales?per_page=${perpage}&page=${page}`,
            }),
            providesTags:['SaleReports']
        }),

        getSaleReport: builder.query({
            query: (id) => ({
                method: 'GET',
                url: `/admin/sales/${id}`,
            }),
            providesTags:['SaleReports']
        }),
    }),


})


export const {
    useGetSaleReportsQuery,
    useGetSaleReportQuery,
} = saleReportsApi