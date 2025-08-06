import { clearAuthTokens, setAuthTokens } from "../slices/auth/authSlice";
import { baseApi } from "./baseApi";

const authApis = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // Login Endpoint (Mutation)
        login: builder.mutation({
            query: (credentials) => ({
                url: "/auth/login",
                method: "POST",
                body: credentials,
            }),
            invalidatesTags: ["User"],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    const accessToken = data?.data?.accessToken;
                    if (accessToken) {
                        dispatch(setAuthTokens({ accessToken }));
                    }
                } catch (error) {
                    console.error("Login failed:", error);
                }
            },
        }),

        // GET PROFILE
        getProfile: builder.query({
            query: () => {
                return {
                    url: '/admin/info',
                    method: 'GET'
                }
            },
            providesTags: ['profile']
        }),

        // UPDATE PROFILE
        updateProfile: builder.mutation({
            query: (data) => {
                return {
                    url: '/admin/update',
                    method: 'PUT',
                    body: data
                }
            },
            invalidatesTags: ['profile']
        }),

        // CHANGE PASSWORD
        changePassword: builder.mutation({
            query: (data) => {
                return {
                    url: "/auth/change-password",
                    method: 'PUT',
                    body: data
                }
            }
        }),

        // FORGET PASSWORD
        forgetPassword: builder.mutation({
            query: (data) => {
                return {
                    url: '/admin/recovery',
                    method: 'POST',
                    body: data
                }
            }
        }),

        // VERIFY EMAIL
        verifyEmail: builder.mutation({
            query: (data) => {
                return {
                    url: "/admin/recovery-verification",
                    method: "POST",
                    body: data
                }
            }
        }),

        // RESET PASSWORD
        resetPassword: builder.mutation({
            query: (data) => {
                return {
                    url: '/admin/reset-password',
                    method: 'POST',
                    body: data,
                }
            }
        }),

        // LOGOUT ENDPOINT
        logout: builder.mutation({
            queryFn: () => ({ data: {} }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(clearAuthTokens());
                } catch (error) {
                    console.log(error);
                }
            },
            invalidatesTags: ["User"],
        }),
    })
})

export const { useLoginAdminMutation, useChangePasswordMutation, useGetAdminProfileQuery, useUpdateAdminProfileMutation, useForgetPasswordMutation, useVerifyEmailMutation, useResetPasswordMutation } = authApis;