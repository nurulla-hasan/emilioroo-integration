import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseQuery = fetchBaseQuery({
    baseUrl : 'https://your-api-backend.com/api', 
    prepareHeaders  :  (headers, { getState })=>{
        const token = getState().auth.accessToken; 
    
        if(token){
            headers.set('authorization' , `Bearer ${token}`)
        }
        
        return headers
    }
})

export const baseApi = createApi({
    reducerPath : 'baseApi',
    baseQuery,
    tagTypes : ['User'],
    endpoints : ()=>({})
})