import { baseApi } from "./baseApi";

const chatApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // GET CHAT LIST
        getChatList: builder.query({
            query: (args) => {
                const params = new URLSearchParams();
                if (args) {
                    Object.entries(args).forEach(([key, value]) => {
                        if (value) {
                            params.append(key, value);
                        }
                    });
                }
                return {
                    url: "/conversation/get-chat-list",
                    method: "GET",
                    params
                }
            },
            providesTags: ["CONVERSATIONS"],
        }),

        // GET SINGLE CONVERSATION
        getSingleConversation: builder.query({
            query: (args) => {
                const params = new URLSearchParams();
                if (args) {
                    Object.entries(args).forEach(([key, value]) => {
                        if (value) {
                            params.append(key, value);
                        }
                    });
                }
                return {
                    url: `/message/get-messages?${params.toString()}`,
                    method: "GET",
                }
            },
            providesTags: ["CONVERSATIONS"],
        }),

    }),
});

export const { useGetChatListQuery, useGetSingleConversationQuery } = chatApi;