let audio;

export const getAudio = () => {
    if (typeof window !== 'undefined') {
        if (!audio) {
            audio = new Audio();
        }
    }
    return audio;
};