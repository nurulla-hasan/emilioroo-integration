import { baseApi } from "./baseApi"



const institutionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // CREATE INSTITUTION
        createInstitution: builder.mutation({
            query: (data) => ({
                url: "/institution/create",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["INSTITUTIONS"],
        }),

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

        // UPDATE INSTITUTION
        updateInstitution: builder.mutation({
            query: (id) => ({
                url: `/institution/update/${id}`,
                method: "PATCH",
            }),
            invalidatesTags: ["INSTITUTIONS"],
        }),

        // DELETE INSTITUTION
        // deleteInstitution: builder.mutation({
        //     query: (id) => ({
        //         url: `/institution/delete/${id}`,
        //         method: "DELETE",
        //     }),
        // }),

    }),
})

export const {
    useCreateInstitutionMutation,
    useGetAllInstitutionQuery,
    useGetSingleInstitutionQuery,
    useUpdateInstitutionMutation,
    // useDeleteInstitutionMutation,
} = institutionApi

