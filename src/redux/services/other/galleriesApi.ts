import { apiSlice } from "../apiSlice";




const apiWithTag = apiSlice.enhanceEndpoints({addTagTypes: ['Galleries','Gallery']})

export const galleriesApi = apiWithTag.injectEndpoints({
    endpoints: (builder) => ({
        getGalleries: builder.query({
            query: () => ({
                method: 'GET',
                url: `/admin/gallery`,
            }),
            providesTags:['Galleries']
        }),

        getGallery: builder.query({
            query: (id) => ({
                method: 'GET',
                url: `/admin/gallery/${id}`,
            }),
            providesTags:['Gallery']
        }),


        addGallery: builder.mutation({
            query: (patch) => ({
                method:'POST',
                url:`/admin/gallery`,
                body:patch
            }),
            invalidatesTags:['Galleries']
        }),

        updateGallery: builder.mutation({
            query: ({id,patch}) => ({
                method:'PUT',
                url:`/admin/gallery/${id}`,
                body:{...patch}
            })
        }),

        deleteGallery :  builder.mutation({
            query: (id) => ({
                method: 'DELETE',
                url: `/admin/gallery/${id}`,
            }),
            invalidatesTags:['Galleries']
        }),


    }),


})


export const {
    useGetGalleriesQuery,
    useGetGalleryQuery,
    useDeleteGalleryMutation,
    useAddGalleryMutation,
    useUpdateGalleryMutation,
} = galleriesApi