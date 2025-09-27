import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQueryWithAuth = async (args, api, extraOptions) => {
    let result = await fetchBaseQuery({
        baseUrl: 'https://api.bankybondy.com',
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.accessToken;

            if (token) {
                headers.set('Authorization', `${token}`)
            }

            return headers
        }
    })(args, api, extraOptions);

    // Handle 401 Unauthorized or 403 Forbidden
    if (result?.error?.status === 401 || result?.error?.status === 403) {
        // Clear user data from store (you might need to adjust this based on your auth slice)
        api.dispatch({ type: 'auth/logout' });
        
        // Redirect to login page
        if (typeof window !== 'undefined') {
            window.location.href = 'auth/login';
        }
    }

    return result;
};

export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: baseQueryWithAuth,

    tagTypes: ['PROFILE', 'BONDS', 'PROJECTS', 'USERS', 'INSTITUTIONS', 'DONATION', 'AUDIO', 'COMMENTS', 'REPLY', 'LIKES', 'RELATIVES', 'FRIENDS', 'CONVERSATIONS', 'MEDIA', 'LEGAL'],
    endpoints: () => ({})
})
