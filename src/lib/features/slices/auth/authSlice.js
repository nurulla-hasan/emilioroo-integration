import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    accessToken: null,
};

export const authSlice = createSlice({
    name : "auth",
    initialState,
    reducers: {
        setAuthTokens: (state, action) => {
            state.accessToken = action.payload.accessToken;
        },
        clearAuthTokens: (state) => {
            state.accessToken = null;
        }
    }
})

export const { setAuthTokens, clearAuthTokens } = authSlice.actions

export default authSlice.reducer