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
            providesTags: (result, error, arg) => result ? [{ type: 'CONVERSATIONS', id: arg.id }]
                : [],
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
                    url: `/message/get-messages`,
                    method: "GET",
                    params
                }
            },
            providesTags: (result, error, arg) => result ? [{ type: 'CONVERSATIONS', id: arg.id }]
                : [],
        }),

        // GET MEDIA
        getMedia: builder.query({
            query: ({ id, args }) => {
                const params = new URLSearchParams();
                if (args) {
                    Object.entries(args).forEach(([key, value]) => {
                        if (value) {
                            params.append(key, value);
                        }
                    });
                }
                return {
                    url: `/conversation/get-media-files/${id}`,
                    method: "GET",
                    params
                }
            },
            providesTags: (result, error, arg) => result ? [{ type: 'MEDIA', id: arg.id }]: [],
        }),

        // CREATE GROUP CHAT
        createGroup: builder.mutation({
            query: (data) => ({
                url: "/chat-group/create",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["CONVERSATIONS"],
        }),

        // UPLOAD FILE
        uploadFile: builder.mutation({
            query: (data) => ({
                url: "file-upload/upload-conversation-files",
                method: "POST",
                body: data,
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'MEDIA', id: arg.conversationId }],
        }),

        // DELETE UPLOADED FILE
        deleteUploadedFile: builder.mutation({
            query: (data) => ({
                url: `/file-upload/delete-files/`,
                method: "POST",
                body: data
            }),
        }),

    }),
});

export const { useGetChatListQuery, useGetSingleConversationQuery, useGetMediaQuery, useCreateGroupMutation, useUploadFileMutation, useDeleteUploadedFileMutation } = chatApi;