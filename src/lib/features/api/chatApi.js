import { baseApi } from "./baseApi";

const chatApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // GET CHAT LIST
        getChatList: builder.query({
            query: () => ({
                url: "/conversation/get-chat-list",
                method: "GET",
            }),
            providesTags: ["CONVERSATIONS"],
        }),

        
    }),
});

export const { useGetChatListQuery } = chatApi;
