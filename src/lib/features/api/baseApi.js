import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseQuery = fetchBaseQuery({
    // baseUrl: 'http://10.10.20.70:4000',
    // baseUrl: 'http://10.10.20.9:4000',
    baseUrl: 'https://rnj64vmh-4000.inc1.devtunnels.ms',
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.accessToken;

        if (token) {
            headers.set('Authorization', `${token}`)
        }

        return headers
    }
})

export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery,

    tagTypes: ['PROFILE', 'BONDS', 'PROJECTS', 'USERS', 'INSTITUTIONS', 'DONATION', 'AUDIO', 'COMMENTS', 'REPLY', 'LIKES', 'RELATIVES', 'FRIENDS', 'CONVERSATIONS', 'MEDIA', 'LEGAL'],
    endpoints: () => ({})
})