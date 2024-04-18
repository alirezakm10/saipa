import { FileManagerType } from "@/components/adminpanel/filemanager/typescope";
import { apiSlice } from "./apiSlice";
import { createEntityAdapter } from "@reduxjs/toolkit";


const apiWithTag = apiSlice.enhanceEndpoints({ addTagTypes: ['AllMedias', 'Directory'] })

const filesAdapter = createEntityAdapter<FileManagerType>({
    selectId:(file:FileManagerType) => file.id
})
const filesSelector = filesAdapter.getSelectors()


export const filemanagerApi = apiWithTag.injectEndpoints({
    // below endpoint get all categories with children for rendering a treeview list in categoryTab component inside classification
    endpoints: (builder) => ({
        getAllMedias: builder.query({
            query: () => ({
                method: 'GET',
                url: '/admin/files?directory=&per_page&page&searchTerm',
            }),
            providesTags: ['AllMedias']
        }),

        getDesiredFolder: builder.query({
            query: ({ dir, page,perPage, searchTerm }) => ({
                method: 'GET',
                url: `/admin/files?directory=${dir}&per_page=${perPage}&page=${page}&searchTerm=${searchTerm}`,
                
            }),
            providesTags: ['Directory']
         
         }),



        customUpload: builder.mutation({
            query: (formData) => ({
                method: 'POST',
                url: '/admin/files/upload',
                headers: {
                    'Content-Type': 'multipart/form-data;'
                },
                body: { formData },
                formData: true
            }),
         
            invalidatesTags: ['AllMedias', 'Directory']
        }),


        deleteFiles: builder.mutation({
            query: (files) => ({
                method: 'DELETE',
                url: '/admin/files/delete',
                body: files,

            }),
            invalidatesTags: ['Directory']
        }),

    }),


})


export const {
    useGetAllMediasQuery,
    useCustomUploadMutation,
    useGetDesiredFolderQuery,
    useDeleteFilesMutation,
} = filemanagerApi

export {
    filesAdapter,
    filesSelector
}