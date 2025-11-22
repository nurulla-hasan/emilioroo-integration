import { baseApi } from "./baseApi";

const bondsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // GET MY BONDS
        getMyBonds: builder.query({
            query: () => ({
                url: "/bond/my-bonds",
                method: "GET",
            }),
            providesTags: ["BONDS"],
        }),

        // GET SINGLE BOND LINK
        getSingleBondLink: builder.query({
            query: (id) => ({
                url: `/bond-link/get-single-bond-link/${id}`,
                method: "GET",
            }),
            providesTags: ["BONDS"],
        }),

        // MARK AS COMPLETED
        markAsCompleted: builder.mutation({
            query: (id) => ({
                url: `/bond-link/mark-as-complete/${id}`,
                method: "POST",
            }),
            invalidatesTags: ["BONDS"],
        }),

        // GET MY BONDS REQUEST
        getMyBondsRequest: builder.query({
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
                    url: `/bond-request/my-bond-requests`,
                    method: "GET",
                    params
                };
            },
            providesTags: ["BONDS"],
        }),


        // GET MATCHING BONDS
        getMatchingBonds: builder.query({
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
                    url: `/bond-request/matching-bond`,
                    method: "GET",
                    params
                };
            },
            providesTags: ["BONDS"],
        }),

        // GET MY BOND SELECT ITEMS
        getMyBondSelectItems: builder.query({
            query: () => ({
                url: "/bond/get-filter-items",
                method: "GET",
            }),
            providesTags: ["BONDS"],
        }),

        // GET ONGOING BONDS
        getOngoingBonds: builder.query({
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
                    url: "/bond-link/my-bond-links",
                    method: "GET",
                    params
                }
            },
            providesTags: ["BONDS"],
        }),

        // GET BOND FILTER ITEMS
        getFilterItems: builder.query({
            query: () => ({
                url: "/bond/get-filter-items",
                method: "GET",
            }),
            providesTags: ["BONDS"],
        }),

        // GET BOND FILTER ITEMS
        getLastBondLocation: builder.query({
            query: () => ({
                url: "bond-request/get-last-bond",
                method: "GET",
            }),
            providesTags: ["BONDS"],
        }),

        // =================================================================================

        // CREATE MY BOND
        createMyBond: builder.mutation({
            query: (data) => ({
                url: "/bond/create",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["BONDS"],
        }),

        // CREATE BOND REQUEST
        createRequestBond: builder.mutation({
            query: (data) => ({
                url: "/bond-request/create",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["BONDS"],
        }),

        // UPDATE MY BOND
        updateMyBond: builder.mutation({
            query: ({ id, data }) => ({
                url: `/bond/update/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["BONDS"],
        }),

        // DELETE MY BOND
        deleteMyBond: builder.mutation({
            query: (id) => ({
                url: `/bond/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["BONDS"],
        }),

        // UPDATE BOND REQUEST
        updateRequestBond: builder.mutation({
            query: ({ id, data }) => ({
                url: `/bond-request/update/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["BONDS"],
        }),

        // DELETE BOND REQUEST
        deleteRequestBond: builder.mutation({
            query: (id) => ({
                url: `/bond-request/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["BONDS"],
        }),

        // CREATE BOND LINK
        createBondLink: builder.mutation({
            query: (data) => ({
                url: "/bond-link/create",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["BONDS", "CONVERSATIONS"],
        }),

        // GIVE RATING
        giveRating: builder.mutation({
            query: (data) => ({
                url: "/bond-rating/add-rating",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["BONDS"],
        }),

    }),
});

export const { useGetMyBondsQuery, useGetMyBondsRequestQuery, useGetMatchingBondsQuery, useGetOngoingBondsQuery, useGetFilterItemsQuery, useGetLastBondLocationQuery, useCreateMyBondMutation, useCreateRequestBondMutation, useUpdateMyBondMutation, useDeleteMyBondMutation, useUpdateRequestBondMutation, useDeleteRequestBondMutation, useGetMyBondSelectItemsQuery, useCreateBondLinkMutation, useGetSingleBondLinkQuery, useMarkAsCompletedMutation, useGiveRatingMutation } = bondsApi;