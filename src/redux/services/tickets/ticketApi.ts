
import { apiSlice } from "../apiSlice";

const apiWithTag = apiSlice.enhanceEndpoints({
  addTagTypes: ["Ticket", "Message"],
});

export const ticketsApi = apiWithTag.injectEndpoints({
  endpoints: (builder) => ({
    getTickets: builder.query({
      query: ({ perpage, page , status , priority , role_id }) => {
        let url = `/admin/tickets?per_page=${perpage}&page=${page}`;
        if (status) {
          url += `&status=${status}`;
        }
        if(priority){
          url += `&priority=${priority}`;
        }
        if(role_id){
          url += `&role_id=${role_id}`;
        }
        return { url, method: 'GET' };
      },
      providesTags: ["Ticket"],
    }),
    getRecentTickets : builder.query({
      query: () => ({
        method: "GET",
        url: `/admin/dashboard/ticket/messages`,
      }),
      providesTags: ["Message"],
    }),

    getTicket: builder.query({
      query: (id) => ({
        method: "GET",
        url: `/admin/tickets?id=${id}`,
      }),
      providesTags: ["Ticket"],
    }),

    getTicketMessages: builder.query({
      query: (id) => ({
        method: "GET",
        url: `/admin/tickets/${id}/messages`,
      }),
      providesTags: ["Message"],
    }),

    CreateTicket: builder.mutation({
      query: (body) => ({
        method: "POST",
        url: `/admin/tickets`,
        body,
      }),
      invalidatesTags: ["Ticket"],
    }),

    responseToTicket: builder.mutation({
      query: ({ id, body }) => ({
        method: "POST",
        url: `/admin/tickets/${id}/messages`,
        body,
      }),
      invalidatesTags: ["Message"],
    }),

    referTicket: builder.mutation({
      
      query: ({ id, body }) => ({
        method: "PUT",
        url: `/admin/tickets/${id}/refer-to`,
        body,
      }),
      // invalidatesTags: ["Ticket"],
    }),

    openTicket: builder.mutation({
      query: (id) => ({
        method: "PATCH",
        url: `/admin/tickets/${id}/open`,
      }),
      invalidatesTags: ["Message"],
    }),

    closeTicket: builder.mutation({
      query: (id) => ({
        method: "PATCH",
        url: `/admin/tickets/${id}/close`,
      }),
      invalidatesTags: ["Message"],
    }), 

    changePriority : builder.mutation({
      query: ({id , body}) => ({
        method: "PUT",
        url: `/admin/tickets/${id}/priority`,
        body
      }),
      invalidatesTags: ["Message"],
    })
   
  }),
});

export const {
  useGetTicketsQuery,
  useGetTicketQuery,
  useGetTicketMessagesQuery,
  useCreateTicketMutation,
  useResponseToTicketMutation,
  useCloseTicketMutation,
  useOpenTicketMutation,
  useReferTicketMutation,
  useChangePriorityMutation,
  useGetRecentTicketsQuery,
} = ticketsApi;
