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


        // CREATE INSTITUTION
        createInstitution: builder.mutation({
            query: (data) => ({
                url: "/institution/create",
                method: "POST",
                body: data,
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
        // deleteInstitution: builder.mutation({
        //     query: (id) => ({
        //         url: `/institution/delete/${id}`,
        //         method: "DELETE",
        //     }),
        //     invalidatesTags: ["INSTITUTIONS"],
        // }),

    }),
})

export const {
    useCreateInstitutionMutation,
    useGetAllInstitutionQuery,
    useGetSingleInstitutionQuery,
    useUpdateInstitutionMutation,
    useJoinInstitutionMutation,
    // useDeleteInstitutionMutation,
} = institutionApi

