import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentAudio: null, // Stores the full audio object that is currently playing
    isPlaying: false,
    progress: 0, // Current playback progress in percentage (0-100)
    volume: 1, // Current volume (0-1)
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
    },
});

export const { playAudio, pauseAudio, updateProgress, setVolume, clearAudio } = audioSlice.actions;
export default audioSlice.reducer;
