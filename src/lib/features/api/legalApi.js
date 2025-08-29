import { baseApi } from "./baseApi"


const legalApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // GET TERMS
        getTerms: builder.query({
            query: () => ({
                url: "/manage/get-terms-conditions",
                method: "GET",
            }),
        }),

        // GET PRIVACY POLICY
        getPrivacyPolicy: builder.query({
            query: () => ({
                url: "/manage/get-privacy-policy",
                method: "GET",
            }),
        }),

    }),
})

export const { useGetTermsQuery, useGetPrivacyPolicyQuery } = legalApi