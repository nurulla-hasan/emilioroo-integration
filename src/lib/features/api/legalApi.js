import { baseApi } from "./baseApi"


const legalApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({


        // GET ABOUT
        getAbout: builder.query({
            query: () => ({
                url: "/manage/get-about-us",
                method: "GET",
            }),
            providesTags: ["LEGAL"],
        }),

        // GET TERMS
        getTerms: builder.query({
            query: () => ({
                url: "/manage/get-terms-conditions",
                method: "GET",
            }),
            providesTags: ["LEGAL"],
        }),

        // GET PRIVACY POLICY
        getPrivacyPolicy: builder.query({
            query: () => ({
                url: "/manage/get-privacy-policy",
                method: "GET",
            }),
            providesTags: ["LEGAL"],
        }),

    }),
})

export const { useGetAboutQuery, useGetTermsQuery, useGetPrivacyPolicyQuery } = legalApi