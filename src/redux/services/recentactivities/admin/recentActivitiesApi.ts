import { apiSlice } from "../../apiSlice"




const apiWithTag = apiSlice.enhanceEndpoints({ addTagTypes: ['AdminActivities'] })

export const recentActivitiesApi = apiWithTag.injectEndpoints({
    // below endpoint get all categories with children for rendering a treeview list in categoryTab component inside classification
    endpoints: (builder) => ({
        getAdminActivities: builder.query({
            query: ({userId, entityType, perpage ,page}) => ({
                method: 'GET',
                url: `/admin/logs?user_id=${userId}&entity_type=${entityType}`,
            }),
            providesTags: ['AdminActivities']
        }),

       
    }),

})

export const {
  useGetAdminActivitiesQuery
} = recentActivitiesApi