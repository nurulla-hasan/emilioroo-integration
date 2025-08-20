import { baseApi } from "./baseApi";


const relativesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // GET ALL RELATIVES
        getAllRelatives: builder.query({
            query: () => ({
                url: "/relative/all-relatives",
                method: "GET",
            }),
            providesTags: ["RELATIVES"],
        }),

        // CREATE RELATIVE
        createRelative: builder.mutation({
            query: (data) => ({
                url: "/relative/add-relative",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["RELATIVES"],
        }),

        // UPDATE RELATIVE
        updateRelative: builder.mutation({
            query: ({ id, data }) => ({
                url: `/relative/update-relative/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["RELATIVES"],
        }),

        // DELETE RELATIVE
        deleteRelative: builder.mutation({
            query: (id) => ({
                url: `/relative/delete-relative/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["RELATIVES"],
        }),
    }),
});

export const {
    useGetAllRelativesQuery,
    useCreateRelativeMutation,
    useUpdateRelativeMutation,
    useDeleteRelativeMutation
} = relativesApi;