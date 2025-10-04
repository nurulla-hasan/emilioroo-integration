import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    totalAudio: null,
    currentAudio: null,
    isPlaying: false,
    progress: 0,
    volume: 1,
};

const audioSlice = createSlice({
    name: 'audio',
    initialState,
    reducers: {
        playAudio: (state, action) => {
            state.currentAudio = action.payload;
            state.isPlaying = true;
        },
        pauseAudio: (state) => {
            state.isPlaying = false;
        },
        updateProgress: (state, action) => {
            state.progress = action.payload;
        },
        setVolume: (state, action) => {
            state.volume = action.payload;
        },
        clearAudio: (state) => {
            state.currentAudio = null;
            state.isPlaying = false;
            state.progress = 0;
        },
        setTotalAudio: (state, action) => {
            state.totalAudio = action.payload;
        },
    },
});

export const { playAudio, pauseAudio, updateProgress, setVolume, clearAudio, setTotalAudio } = audioSlice.actions;
export default audioSlice.reducer;
