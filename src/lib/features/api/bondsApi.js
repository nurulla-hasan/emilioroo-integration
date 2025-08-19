import { baseApi } from "./baseApi";

const bondsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // GET MY BONDS
        getMyBonds: builder.query({
            query: () => ({
                url: "/bond/my-bonds",
                method: "GET",
            }),
            providesTags: ["MY-BONDS"],
        }),

        // GET MY BONDS REQUEST
        getMyBondsRequest: builder.query({
            query: () => ({
                url: "/bond-request/my-bond-requests",
                method: "GET",
            }),
            providesTags: ["MY-BONDS-REQUEST"],
        }),


        // GET MATCHING BONDS
        getMatchingBonds: builder.query({
            query: (id) => ({
                url: "/bond-request/matching-bond",
                method: "GET",
                body: id,
            }),
            providesTags: ["MATCHING_BONDS"],
        }),

        // CREATE MY BOND
        createMyBond: builder.mutation({
            query: (data) => ({
                url: "/bond/create",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["MY-BONDS"],
        }),

        // CREATE BOND REQUEST
        createRequestBond: builder.mutation({
            query: (data) => ({
                url: "/bond-request/create",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["MY-BONDS-REQUEST"],
        }),

        // UPDATE MY BOND
        updateMyBond: builder.mutation({
            query: ({ id, data }) => ({
                url: `/bond/update/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["MY-BONDS"],
        }),

        // DELETE MY BOND
        deleteMyBond: builder.mutation({
            query: (id) => ({
                url: `/bond/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["MY-BONDS"],
        }),

        // UPDATE BOND REQUEST
        updateRequestBond: builder.mutation({
            query: ({ id, data }) => ({
                url: `/bond-request/update/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["MY-BONDS-REQUEST"],
        }),

        // DELETE BOND REQUEST
        deleteRequestBond: builder.mutation({
            query: (id) => ({
                url: `/bond-request/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["MY-BONDS-REQUEST"],
        }),


    }),
});

export const { useGetMyBondsQuery, useGetMyBondsRequestQuery, useGetMatchingBondsQuery, useCreateMyBondMutation, useCreateRequestBondMutation, useUpdateMyBondMutation, useDeleteMyBondMutation, useUpdateRequestBondMutation, useDeleteBondMutation } = bondsApi;