import { apiSlice } from "../apiSlice";




const apiWithTag = apiSlice.enhanceEndpoints({addTagTypes: ['ShopSettings']})

export const shopSettingsApi = apiWithTag.injectEndpoints({
    endpoints: (builder) => ({
        getShopSettings: builder.query({
            query: () => ({
                method: 'GET',
                url: `/admin/shop/settings`,
            }),
            providesTags:['ShopSettings']
        }),




        updateShopSettings: builder.mutation({
            query: (patch) => ({
                method:'PUT',
                url:`/admin/shop/settings`,
                body:patch
            }),
            invalidatesTags:['ShopSettings']
        }),
    }),

})


export const {
    useGetShopSettingsQuery,
    useUpdateShopSettingsMutation
} = shopSettingsApi