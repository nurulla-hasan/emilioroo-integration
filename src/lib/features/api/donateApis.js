import { toast } from "sonner";

const { baseApi } = require("./baseApi");

const donateApis = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // donate
        donate: builder.mutation({
            query: (data) => ({
                url: '/donate/donate',
                method: 'POST',
                body: data
            }),
            async onQueryStarted(arg, { queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    if (data?.data?.url) {
                        window.location.href = data?.data?.url;
                    }
                } catch (error) {
                    toast.error(error?.error?.data?.message === "Your are not authorized 1" && "Please login first");
                    console.log(error);
                }
            },
        }),

        // get all donner
        getAllDonner: builder.query({
            query: () => ({
                url: '/donate/get-all-donner',
                method: 'GET'
            })
        }),

    }),
})

export const { useDonateMutation } = donateApis;