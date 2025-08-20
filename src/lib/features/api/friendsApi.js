import { baseApi } from "./baseApi";


const friendsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // GET MY FRIENDS
        getMyFriends: builder.query({
            query: () => ({
                url: "/friends/my-friends",
                method: "GET",
            }),
            providesTags: ["FRIENDS"],
        }),

        // GET FOLLOWERS
        getFollowers: builder.query({
            query: () => ({
                url: "/friend-request/followers",
                method: "GET",
            }),
            providesTags: ["FRIENDS"],
        }),

        // GET FOLLOWING
        getFollowing: builder.query({
            query: () => ({
                url: "/friend-request/following",
                method: "GET",
            }),
            providesTags: ["FRIENDS"],
        }),

        // ------=======================----------------------========================---------------------===============

        // SENT REQUEST
        sentRequest: builder.mutation({
            query: (data) => ({
                url: "/friend-request/send",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["FRIENDS"],
        }),

        // CANCEL REQUEST
        cancelRequest: builder.mutation({
            query: (id) => ({
                url: `/friend-request/cancel/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["FRIENDS"],
        }),

        // ACCEPT AND REJECT REQUEST
        acceptAndEjectRequest: builder.mutation({
            query: ({id, data}) => ({
                url: `/friend-request/accept-reject/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["FRIENDS"],
        }),

        // UNFRIEND
        unfriend: builder.mutation({
            query: (id) => ({
                url: `/friend-request/unfriend/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["FRIENDS"],
        }),

    }),
});

export const { useGetMyFriendsQuery, useSentRequestMutation, useCancelRequestMutation, useAcceptAndEjectRequestMutation } = friendsApi;