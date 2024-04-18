import {
    createApi,
    fetchBaseQuery
} from "@reduxjs/toolkit/dist/query/react";
import { getSession } from "next-auth/react";


const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: async (headers, {getState}) => {
        // const language = (getState() as RootState).configs.language
        const session = await getSession()
    
        if (session) {
            headers.set("authorization", `Bearer ${session.token}`)
            headers.set("Accept-language", "fa")
            headers.set("Accept", "application/json")
        }else {
            headers.set("authorization", `unauthorized`)
        }
    }
}
)


export const apiSlice = createApi({
    baseQuery: baseQuery,
    // global configuration for the api
    refetchOnReconnect: true,
    tagTypes:['categories'],
    endpoints: builder => ({})
})