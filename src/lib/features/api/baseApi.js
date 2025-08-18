import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseQuery = fetchBaseQuery({
    baseUrl : 'http://10.10.20.70:4000', 
    prepareHeaders  :  (headers, { getState })=>{
        const token = getState().auth.accessToken;
    
        if(token){
            headers.set('Authorization' , `${token}`)
        }
        
        return headers
    }
})

export const baseApi = createApi({
    reducerPath : 'baseApi',
    baseQuery,
        tagTypes : ['PROFILE', 'MY_BONDS', 'MY_BONDS_REQUEST', 'MATCHING_BONDS', 'PROJECTS', 'USERS', 'INSTITUTIONS', 'DONATION', 'AUDIO', 'CommentReplies'],
    endpoints : ()=>({})
})