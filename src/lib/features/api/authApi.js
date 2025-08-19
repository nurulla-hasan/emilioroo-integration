import { toast } from "sonner";
import { clearAuthTokens, setAuthTokens } from "../slices/auth/authSlice";
import { persistor } from "../../store";
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
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    const accessToken = data?.data?.accessToken;
                    if (accessToken) {
                        dispatch(setAuthTokens({ accessToken }));
                    }
                    toast.success("Login successful!");
                } catch (error) {
                    toast.error(error?.error?.data?.message || "Login failed.");
                }
            },
        }),

        // Register Endpoint (Mutation)
        register: builder.mutation({
            query: (credentials) => ({
                url: "/user/register-user",
                method: "POST",
                body: credentials,
            }),
            async onQueryStarted(arg, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                    toast.success("Registration successful! Please check your email for OTP verification.");
                } catch (error) {
                    toast.error(error?.error?.data?.message || "Registration failed.");
                }
            },
        }),

        // GET SKILLS
        getSkills: builder.query({
            query: () => ({
                url: '/skill/all-skills',
                method: 'GET'
            })
        }),

        // VERIFY OTP
        verifyOTP: builder.mutation({
            query: (data) => ({
                url: '/user/verify-code',
                method: 'POST',
                body: data
            }),
            async onQueryStarted(arg, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                    toast.success("OTP verification successful!");
                } catch (error) {
                    toast.error(error?.error?.data?.message || "OTP verification failed.");
                }
            },
        }),

        // RESEND OTP
        resendOTP: builder.mutation({
            query: (email) => ({
                url: '/user/resend-verify-code',
                method: 'POST',
                body: { email }
            }),
            async onQueryStarted(arg, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                    toast.success("New OTP sent to your email!");
                } catch (error) {
                    toast.error(error?.error?.data?.message || "Failed to send new OTP.");
                }
            },
        }),

        // FORGET PASSWORD
        forgetPassword: builder.mutation({
            query: (email) => {
                return {
                    url: '/auth/forget-password',
                    method: 'POST',
                    body: { email }
                }
            }
        }),

        // RESET PASSWORD
        resetPassword: builder.mutation({
            query: (data) => {
                return {
                    url: '/auth/reset-password',
                    method: 'POST',
                    body: data,
                }
            }
        }),

        // OTP VERIFY FOR RESET PASSWORD
        verifyOTPForResetPassword: builder.mutation({
            query: (data) => ({
                url: '/auth/verify-reset-otp',
                method: 'POST',
                body: data
            }),
            async onQueryStarted(arg, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                    toast.success("OTP verification successful!");
                } catch (error) {
                    toast.error(error?.error?.data?.message || "OTP verification failed.");
                }
            },
        }),

        // RESEND RESET OTP
        resendResetOTP: builder.mutation({
            query: (email) => ({
                url: '/auth/resend-reset-code',
                method: 'POST',
                body: { email }
            }),
            async onQueryStarted(arg, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                    toast.success("New OTP sent to your email!");
                } catch (error) {
                    toast.error(error?.error?.data?.message || "Failed to send new OTP.");
                }
            },
        }),

        // GET MY PROFILE
        getProfile: builder.query({
            query: () => {
                return {
                    url: '/user/get-my-profile',
                    method: 'GET'
                }
            },
            providesTags: ['PROFILE']
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
            invalidatesTags: ['Profile']
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

        // LOGOUT ENDPOINT
        logout: builder.mutation({
            queryFn: () => ({ data: {} }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(clearAuthTokens());
                    await persistor.purge();
                } catch (error) {
                    console.log(error);
                }
            },
        }),

    })
})

export const { useLoginMutation, useRegisterMutation, useGetSkillsQuery, useVerifyOTPMutation, useVerifyOTPForResetPasswordMutation, useResendOTPMutation, useResendResetOTPMutation, useGetProfileQuery, useChangePasswordMutation, useUpdateProfileMutation, useForgetPasswordMutation, useResetPasswordMutation, useLogoutMutation } = authApis;