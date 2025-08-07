import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseQuery = fetchBaseQuery({
    baseUrl : 'http://10.10.20.70:4000', 
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
    tagTypes : ['User', 'Profile'],
    endpoints : ()=>({})
})