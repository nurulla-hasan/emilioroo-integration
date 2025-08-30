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
                    url: `/message/get-messages`,
                    method: "GET",
                    params
                }
            },
            providesTags: ["CONVERSATIONS"],
        }),

        // GET MEDIA
        getMedia: builder.query({
            query: (args, id) => {
                const params = new URLSearchParams();
                if (args) {
                    Object.entries(args).forEach(([key, value]) => {
                        if (value) {
                            params.append(key, value);
                        }
                    });
                }
                return {
                    url: `/media/get-media/${id}`,
                    method: "GET",
                    params
                }
            },
            providesTags: ["CONVERSATIONS"],
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