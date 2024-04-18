import { apiSlice } from "../apiSlice";

const apiWithTag = apiSlice.enhanceEndpoints({
    addTagTypes: ["Ticket"],
  });

  export const subjectApi = apiWithTag.injectEndpoints({
    endpoints: (builder) => ({
      getSubjects: builder.query({
        query: () => ({
          method: "GET",
          url: `/admin/subjects`,
        }),
        providesTags: ["Ticket"],
      }),
  
    }),
  });

  export const {
    useGetSubjectsQuery
  } = subjectApi;