import { baseApi } from "./baseApi"



const institutionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // GET ALL INSTITUTION
        getAllInstitution: builder.query({
            query: (args) => {
                const params = new URLSearchParams();
                if (args !== undefined && args.length > 0) {
                    args.forEach((item) => {
                        if (item.value) {
                            params.append(item.name, item.value);
                        }
                    });
                }
                return {
                    url: "/institution/get-all",
                    method: "GET",
                    params,
                };
            },
            keepUnusedDataFor: 600,
            providesTags: ["INSTITUTIONS"],
        }),

        // GET SINGLE INSTITUTION
        getSingleInstitution: builder.query({
            query: (id) => ({
                url: `/institution/get-single/${id}`,
                method: "GET",
            }),
            providesTags: ["INSTITUTIONS"],
        }),

        // GET INSTITUTION MEMBERS
        getInstitutionMembers: builder.query({
            query: (id) => ({
                url: `/institution-member/all-member/${id}`,
                method: "GET",
            }),
            providesTags: ["INSTITUTIONS"],
        }),


        // GET INSTITUTION CONVERSATION
        getInstitutionConversation: builder.query({
            query: (id) => ({
                url: `/institution-conversation/get-all/${id}`,
                method: "GET",
            }),
            providesTags: ["INSTITUTIONS"],
        }),

        // GET CONVERSATION COMMENTS
        getConversationComments: builder.query({
            query: (id) => ({
                url: `/comment/get-conversation-comments/${id}`,
                method: "GET",
            }),
            providesTags: ["COMMENTS"],
        }),

        // GET COMMENT REPLIES
        getCommentReplies: builder.query({
            query: (id) => ({
                url: `/comment/get-replies/${id}`,
                method: "GET",
            }),
            providesTags: ["REPLY"],
        }),

        // GET COMMENT LIKERS
        getCommentLikers: builder.query({
            query: (id) => ({
                url: `/comment/get-comment-likers/${id}`,
                method: "GET",
            }),
            providesTags: ["COMMENTS"],
        }),

        // ----------------------------------- End Get Api ----------------------------------------------------------------------------

        // REMOVE INSTITUTION MEMBER
        removeInstitutionMember: builder.mutation({
            query: (memberId) => ({
                url: `/institution-member/remove-member/${memberId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["INSTITUTIONS"],
        }),


        // CREATE INSTITUTION
        createInstitution: builder.mutation({
            query: (data) => ({
                url: "/institution/create",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["INSTITUTIONS"],
        }),

        // CREATE INSTITUTION CONVERSATION
        createInstitutionConversation: builder.mutation({
            query: (data) => ({
                url: "/institution-conversation/create",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["INSTITUTIONS"],
        }),

        // UPDATE INSTITUTION CONVERSATION
        updateInstitutionConversation: builder.mutation({
            query: ({ id, data }) => ({
                url: `/institution-conversation/update/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["INSTITUTIONS"],
        }),

        // DELETE INSTITUTION CONVERSATION
        deleteInstitutionConversation: builder.mutation({
            query: (topicId) => ({
                url: `/institution-conversation/delete/${topicId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["INSTITUTIONS"],
        }),

        // UPDATE INSTITUTION
        updateInstitution: builder.mutation({
            query: ({ id, data }) => ({
                url: `/institution/update/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["INSTITUTIONS"],
        }),

        // JOIN INSTITUTION
        joinInstitution: builder.mutation({
            query: (data) => ({
                url: "/institution/join-instituion",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["INSTITUTIONS"],
        }),

        // DELETE INSTITUTION
        deleteInstitution: builder.mutation({
            query: (id) => ({
                url: `/institution/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["INSTITUTIONS"],
        }),

        // CREATE COMMENT
        createComment: builder.mutation({
            query: (data) => ({
                url: "/comment/create",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["COMMENTS", "REPLY"],
        }),

        // CREATE REPLY
        createReply: builder.mutation({
            query: (data) => ({
                url: "/comment/create-reply",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["REPLY"],
        }),

        // LIKE UNLIKE COMMENT
        likeUnlikeComment: builder.mutation({
            query: (id) => ({
                url: `/comment/like-unlike/${id}`,
                method: "POST",
            }),
            invalidatesTags: ["LIKES"],
        }),

        // UPDATE COMMENT
        updateComment: builder.mutation({
            query: ({ id, data }) => ({
                url: `/comment/update-comment/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["REPLY", "COMMENTS"],
        }),

        // DELETE COMMENT
        deleteComment: builder.mutation({
            query: (id) => ({
                url: `/comment/delete-comment/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["COMMENTS"],
        }),


    }),
})

export const {
    useCreateInstitutionMutation,
    useGetAllInstitutionQuery,
    useGetSingleInstitutionQuery,
    useUpdateInstitutionMutation,
    useJoinInstitutionMutation,
    useGetInstitutionMembersQuery,
    useGetInstitutionConversationQuery,
    useRemoveInstitutionMemberMutation,
    useCreateInstitutionConversationMutation,
    useUpdateInstitutionConversationMutation,
    useDeleteInstitutionConversationMutation,
    useDeleteInstitutionMutation,
    useGetConversationCommentsQuery,
    useGetCommentRepliesQuery,
    useGetCommentLikersQuery,
    useCreateCommentMutation,
    useCreateReplyMutation,
    useLikeUnlikeCommentMutation,
    useUpdateCommentMutation,
    useDeleteCommentMutation
} = institutionApi

