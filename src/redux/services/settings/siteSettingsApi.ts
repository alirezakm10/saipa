import { apiSlice } from "../apiSlice";




const apiWithTag = apiSlice.enhanceEndpoints({addTagTypes: ['SiteSettings','Menus']})

export const siteSettingsApi = apiWithTag.injectEndpoints({
    endpoints: (builder) => ({
        getSiteSettings: builder.query({
            query: () => ({
                method: 'GET',
                url: `/admin/settings`,
            }),
            providesTags:['SiteSettings']
        }),

        getMenus: builder.query({
            query: () => ({
                method: 'GET',
                url: `/admin/menus`,
            }),
            providesTags:['Menus']
        }),

        
        addMenu: builder.mutation({
            query: (patch) => ({
                method:'POST',
                url:`/admin/menus`,
                body:{...patch}
            }),
            invalidatesTags:['SiteSettings']
        }),

        updateMenuApi: builder.mutation({
            query: ({id,patch}) => ({
                method:'PUT',
                url:`/admin/menus/${id}`,
                body:patch
            }),
            invalidatesTags:['SiteSettings']
        }),  

        updateSiteSettings: builder.mutation({
            query: (patch) => ({
                method:'POST',
                url:`/admin/settings`,
                body:patch
            }),
            invalidatesTags:['SiteSettings']
        }),

        updateLogoPhoto: builder.mutation({
            query: (body) => ({
              method: "POST",
              url: `/admin/settings/logo`,
              body,
            }),
            invalidatesTags: ["SiteSettings"],
          }),


        getSiteSmsSettings: builder.query({
            query: () => ({
                method: 'GET',
                url: `/admin/sms_settings`,
            }),
            providesTags:['SiteSettings']
        }),

        updateSiteSmsSettings: builder.mutation({
            query: (patch) => ({
                method:'POST',
                url:`/admin/sms_settings`,
                body:patch
            }),
            invalidatesTags:['SiteSettings']
        }),

        testSiteSmsSettings: builder.mutation({
            query: (patch) => ({
                method:'PATCH',
                url:`/admin/sms_settings`,
                body:patch
            }),
            invalidatesTags:['SiteSettings']
        }),









        getSiteSmtpSettings: builder.query({
            query: () => ({
                method: 'GET',
                url: `/admin/smtp_settings`,
            }),
            providesTags:['SiteSettings']
        }),

        updateSiteSmtpSettings: builder.mutation({
            query: (patch) => ({
                method:'POST',
                url:`/admin/smtp_settings`,
                body:patch
            }),
            invalidatesTags:['SiteSettings']
        }),

        testSiteSmtpSettings: builder.mutation({
            query: (patch) => ({
                method:'PATCH',
                url:`/admin/smtp_settings`,
                body:patch
            }),
            invalidatesTags:['SiteSettings']
        }),

    }),

})


export const {
    useGetMenusQuery,
    useUpdateMenuApiMutation,
    useAddMenuMutation,
    useGetSiteSettingsQuery,
    useUpdateSiteSettingsMutation,
    useGetSiteSmsSettingsQuery,
    useUpdateSiteSmsSettingsMutation,
    useTestSiteSmsSettingsMutation,
    useGetSiteSmtpSettingsQuery,
    useUpdateSiteSmtpSettingsMutation,
    useTestSiteSmtpSettingsMutation,
    useUpdateLogoPhotoMutation
} = siteSettingsApi