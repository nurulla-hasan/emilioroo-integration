
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    page: 1,
    allUrls: [],
    currentConversationId: null,
};

const mediaSlice = createSlice({
    name: 'media',
    initialState,
    reducers: {
        incrementPage: (state) => {
            state.page += 1;
        },
        addUrls: (state, action) => {
            const existingUrls = new Set(state.allUrls);
            const newUrls = action.payload.urls.filter(url => !existingUrls.has(url));
            state.allUrls.push(...newUrls);
        },
        setMediaConversation: (state, action) => {
            if (state.currentConversationId !== action.payload.conversationId) {
                state.currentConversationId = action.payload.conversationId;
                state.page = 1;
                state.allUrls = [];
            }
        },
        resetMedia: () => initialState,
    },
});

export const { incrementPage, addUrls, setMediaConversation, resetMedia } = mediaSlice.actions;
export default mediaSlice.reducer;
