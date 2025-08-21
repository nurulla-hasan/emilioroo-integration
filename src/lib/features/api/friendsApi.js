import { baseApi } from "./baseApi";


const friendsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // GET MY FRIENDS
        getMyFriends: builder.query({
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
                    url: "/friend-request/friends",
                    method: "GET",
                    params
                }
            },
            keepUnusedDataFor: 600,
            providesTags: ["FRIENDS"],
        }),

        // GET FOLLOWERS
        getFollowers: builder.query({
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
                    url: "/friend-request/followers",
                    method: "GET",
                    params
                }
            },
            keepUnusedDataFor: 600,
            providesTags: ["FRIENDS"],
        }),

        // GET FOLLOWING
        getFollowing: builder.query({
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
                    url: "/friend-request/following",
                    method: "GET",
                    params
                }
            },
            keepUnusedDataFor: 600,
            providesTags: ["FRIENDS"],
        }),

        // ------=======================----------------------========================---------------------=====================------//

        // SENT REQUEST
        sentRequest: builder.mutation({
            query: (data) => ({
                url: "/friend-request/send",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["FRIENDS"],
        }),

        // CANCEL SEND REQUEST
        cancelRequest: builder.mutation({
            query: (id) => ({
                url: `/friend-request/cancel/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["FRIENDS"],
        }),

        // ACCEPT AND REJECT REQUEST
        acceptAndEjectRequest: builder.mutation({
            query: ({ id, data }) => ({
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

export const { useGetMyFriendsQuery, useGetFollowersQuery, useGetFollowingQuery, useSentRequestMutation, useCancelRequestMutation, useAcceptAndEjectRequestMutation, useUnfriendMutation } = friendsApi;