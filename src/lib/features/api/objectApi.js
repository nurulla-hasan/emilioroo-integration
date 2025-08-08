import { baseApi } from "./baseApi"



const objectApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // CREATE OBJECT
        createObject: builder.mutation({
            query: (data) => ({
                url: "/project/create",
                method: "POST",
                body: data,
            }),
        }),

        // GET ALL OBJECTS
        getAllObjects: builder.query({
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
                    url: "/project/all-projects",
                    method: "GET",
                    params,
                };
            },
            keepUnusedDataFor: 600,
            providesTags: ["OBJECTS"],
        }),

        // GET SINGLE OBJECT
        getObject: builder.query({
            query: (id) => ({
                url: `/project/single-project/${id}`,
                method: "GET",
            }),
            providesTags: ["OBJECTS"],
        }),

        // UPDATE OBJECT
        updateObject: builder.mutation({
            query: (id) => ({
                url: `/project/update/${id}`,
                method: "PATCH",
            }),
        }),

        // DELETE OBJECT
        deleteObject: builder.mutation({
            query: (id) => ({
                url: `/project/delete/${id}`,
                method: "DELETE",
            }),
        }),

    }),
})


export const {
    useCreateObjectMutation,
    useGetAllObjectsQuery,
    useGetObjectQuery,
    useUpdateObjectMutation,
    useDeleteObjectMutation,
} = objectApi