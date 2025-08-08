import { baseApi } from "./baseApi";

const bondsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // create bond
        createBond: builder.mutation({
            query: (data) => ({
                url: "/bond-request/create",
                method: "POST",
                body: data,
            }),
        }),


        // GET MY BONDS
        getMyBonds: builder.query({
            query: () => ({
                url: "/bond/my-bonds",
                method: "GET",
            }),
            providesTags: ["MY_BONDS"],
        }),

        // GET MY BONDS REQUEST
        getMyBondsRequest: builder.query({
            query: () => ({
                url: "/bond-request/my-bond-requests",
                method: "GET",
            }),
            providesTags: ["MY_BONDS_REQUEST"],
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

        // UPDATE BOND
        updateBond: builder.mutation({
            query: ({ id, data }) => ({
                url: `/bond-request/update/${id}`,
                method: "PATCH",
                body: data,
            }),
        }),

        // DELETE BOND
        deleteBond: builder.mutation({
            query: (id) => ({
                url: `/bond-request/delete/${id}`,
                method: "DELETE",
            }),
        }),


    }),
});

export const { useCreateBondMutation, useGetMyBondsQuery, useGetMyBondsRequestQuery, useGetMatchingBondsQuery, useUpdateBondMutation, useDeleteBondMutation } = bondsApi;