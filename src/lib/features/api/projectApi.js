import { baseApi } from "./baseApi"

const projectApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // GET ALL PROJECT
        getAllProject: builder.query({
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
            providesTags: ["PROJECTS"],
        }),

        // GET SINGLE PROJECT
        getSingleProject:builder.query({
            query: (id) => ({
                url: `/project/single-project/${id}`,
                method: "GET",
            }),
            providesTags: ["PROJECTS"],
        }),

        // GET JOIN REQUEST
        getJoinRequest:builder.query({
            query: (id) => ({
                url: `/project-join-request/get-join-requests/${id}`,
                method: "GET",
            }),
            providesTags: ["PROJECTS"],
        }),

        // GET PROJECT MEMBER
        getProjectMember:builder.query({
            query: ({ id, type }) => {
                const params = new URLSearchParams();
                if (type) {
                    params.append("type", type);
                }
                return {
                    url: `/project-member/get-project-members/${id}`,
                    method: "GET",
                    params,
                };
            },
            providesTags: ["PROJECTS"],
        }),

        // GET PROJECT DOCUMENT
        getProjectDocument:builder.query({
            query: (id) => ({
                url: `/project-document/get-all/${id}`,
                method: "GET",
            }),
            providesTags: ["PROJECTS"],
        }),

        // GET PROJECT IMAGE
        getProjectImage:builder.query({
            query: (id) => ({
                url: `/project-image/get-all/${id}`,
                method: "GET",
            }),
            providesTags: ["PROJECTS"],
        }),

        //------------------------------------------------------- END GET METHOD-----------------------------------------------------

        // CREATE PROJECT
        createProject:builder.mutation({
            query: (data) => ({
                url: "/project/create",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["PROJECTS"],
        }),

        // UPDATE PROJECT
        updateProject:builder.mutation({
            query: ({ id, formData }) => ({
                url: `/project/update/${id}`,
                method: "PATCH",
                body: formData, // Pass the formData as the body
            }),
            invalidatesTags: ["PROJECTS"],
        }),

        // DELETE PROJECT
        deleteProject:builder.mutation({
            query: (id) => ({
                url: `/project/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["PROJECTS"],
        }),

        // SEND JOIN REQUEST
        sendJoinRequest:builder.mutation({
            query: (id) => ({
                url: `/project-join-request/send-request/${id}`,
                method: "POST",
            }),
            invalidatesTags: ["PROJECTS"],
        }),

        // ACCEPT AND REJECT JOIN REQUEST
        acceptRejectJoinRequest:builder.mutation({
            query: ({id,data}) => ({
                url: `/project-join-request/approve-reject/${id}`,
                method: "PATCH",
                body: data
            }),
            invalidatesTags: ["PROJECTS"],
        }),

        // ADD PROJECT MEMBER
        addProjectMember:builder.mutation({
            query: ({id,data}) => ({
                url: `/project-member/add-member/${id}`,
                method: "POST",
                body: data
            }),
            invalidatesTags: ["PROJECTS"],
        }),

        // REMOVE PROJECT MEMBER
        removeProjectMember:builder.mutation({
            query: (projectMemberId) => ({
                url: `/project-member/remove-member/${projectMemberId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["PROJECTS"],
        }),

        // CREATE PROJECT DOCUMENT
        createProjectDocument:builder.mutation({
            query: ({id,data}) => ({
                url: `/project-document/create/${id}`,
                method: "POST",
                body: data
            }),
            invalidatesTags: ["PROJECTS"],
        }),

        // DELETE PROJECT DOCUMENT
        deleteProjectDocument:builder.mutation({
            query: (id) => ({
                url: `/project-document/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["PROJECTS"],
        }),

        // CREATE PROJECT IMAGE
        createProjectImage:builder.mutation({
            query: ({id,data}) => ({
                url: `/project-image/create/${id}`,
                method: "POST",
                body: data
            }),
            invalidatesTags: ["PROJECTS"],
        }),

        // DELETE PROJECT IMAGE
        deleteProjectImage:builder.mutation({
            query: (id) => ({
                url: `/project-image/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["PROJECTS"],
        }),

        // GET ALL USERS
        getAllUsers:builder.query({
            query: () => ({
                url: "/normal-user/get-all-user",
                method: "GET",
            }),
            providesTags: ["PROJECTS"],
        }),

    }),
})


export const {
    useGetAllProjectQuery,
    useGetSingleProjectQuery,
    useCreateProjectMutation,
    useUpdateProjectMutation,
    useDeleteProjectMutation,
    useGetJoinRequestQuery,
    useSendJoinRequestMutation,
    useAcceptRejectJoinRequestMutation,
    useGetProjectMemberQuery,
    useAddProjectMemberMutation,
    useRemoveProjectMemberMutation,
    useGetProjectDocumentQuery,
    useCreateProjectDocumentMutation,
    useDeleteProjectDocumentMutation,
    useGetProjectImageQuery,
    useCreateProjectImageMutation,
    useDeleteProjectImageMutation,
    useGetAllUsersQuery
} = projectApi