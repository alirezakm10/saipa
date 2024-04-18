import { apiSlice } from "../apiSlice";




const apiWithTag = apiSlice.enhanceEndpoints({addTagTypes: ['Sliders']})

export const slidersApi = apiWithTag.injectEndpoints({
    endpoints: (builder) => ({
        getSliders: builder.query({
            query: ({type}) => ({
                method: 'GET',
                url: `/admin/promotions?type=${type}`,
            }),
            providesTags:['Sliders']
        }),

        getSlider: builder.query({
            query: (id) => ({
                method: 'GET',
                url: `/admin/promotions/${id}`,
            }),
            providesTags:['Sliders']
        }),


        addSlider: builder.mutation({
            query: (patch) => ({
                method:'POST',
                url:`/admin/promotions`,
                body:patch
            }),
            invalidatesTags:['Sliders']
        }),

        updateSlider: builder.mutation({
            query: ({id,patch}) => ({
                method:'PUT',
                url:`/admin/promotions/${id}`,
                body:{...patch}
            }),
            invalidatesTags:['Sliders']
        }),

        deleteSlider :  builder.mutation({
            query: (id) => ({
                method: 'DELETE',
                url: `/admin/promotions/${id}`,
            }),
            invalidatesTags:['Sliders']
        }),

        setDefaultSlider :  builder.mutation({
            query: (id) => ({
                method: 'PATCH',
                url: `/admin/promotions/set_default/${id}`,
            }),
            invalidatesTags:['Sliders']
        }),


    }),


})


export const {
    useGetSlidersQuery,
    useGetSliderQuery,
    useDeleteSliderMutation,
    useAddSliderMutation,
    useUpdateSliderMutation,
    useSetDefaultSliderMutation
} = slidersApi