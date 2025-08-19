const { baseApi } = require("./baseApi");


const profileApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // GET MY PROFILE
        getMyProfile: builder.query({
            query: () => ({
                url: "/user/get-my-profile",
                method: "GET",
            }),
            providesTags: ["PROFILE"],
        }),

        // UPDATE MY PROFILE
        updateMyProfile: builder.mutation({
            query: (data) => ({
                url: "/normal-user/update-profile",
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["PROFILE"],
        }),

    }),
});

export const {
    useGetMyProfileQuery,
    useUpdateMyProfileMutation
} = profileApi