import { setTotalAudio } from "../slices/audio/audioSlice";
import { baseApi } from "./baseApi";


const chattingApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // GET ALL TOPICS
        getAllTopics: builder.query({
            query: () => {
                // const params = new URLSearchParams(arg);
                return {
                    // url: `/topic/all-topics?${params.toString()}`,
                    url: "/topic/all-topics?limit=2000",
                    method: "GET",
                };
            },
            providesTags: ["AUDIO"],
        }),

        // GET ALL AUDIO
        getAllAudio: builder.query({
            query: (arg) => {
                const params = new URLSearchParams(arg);
                return {
                    url: `/audio/all-audios?${params.toString()}`,
                    method: "GET",
                };
            },
            onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
                const { data } = await queryFulfilled;
                dispatch(setTotalAudio(data.data.result.length));
            },
            providesTags: ["AUDIO"],
        }),

        // GET MY AUDIO
        getMyAudio: builder.query({
            query: () => ({
                url: "/audio/my-audios",
                method: "GET",
            }),
            providesTags: ["AUDIO"],
        }),

        // GET SINGLE AUDIO
        getSingleAudio: builder.query({
            query: (id) => ({
                url: `/audio/single-audio/${id}`,
                method: "GET",
            }),
            providesTags: ["AUDIO"],
        }),

        // GET BOOKMARK AUDIO
        getBookmarkAudio: builder.query({
            query: () => ({
                url: "/audio-bookmark/my-bookmark-audios",
                method: "GET",
            }),
            providesTags: ["AUDIO"],
        }),

        // GET ALL PLAYLIST
        getAllPlaylist: builder.query({
            query: (arg) => {
                const params = new URLSearchParams(arg);
                return {
                    url: `/playlist/all-playlists?${params.toString()}`,
                    method: "GET",
                };
            },
            providesTags: ["AUDIO"],
        }),

        // GET MY PLAYLIST
        getMyPlaylist: builder.query({
            query: (arg) => {
                const params = new URLSearchParams(arg);
                return {
                    url: `/playlist/my-playlists?${params.toString()}`,
                    method: "GET",
                };
            },
            providesTags: ["AUDIO"],
        }),

        // GET SINGLE PLAYLIST
        getSinglePlaylist: builder.query({
            query: (id) => ({
                url: `/playlist/single-playlist/${id}`,
                method: "GET",
            }),
            providesTags: ["AUDIO"],
        }),

        // ---------------------------------------------------------------------------------------------------------------------- 

        // CHECK AUDIO
        checkAudio: builder.mutation({
            query: (data) => ({
                url: "https://audio.dsrt321.online/audio_analyze",
                method: "POST",
                body: data,
            }),
        }),

        // --------------------------------------------------------------------------------------------------------------------
        // CREATE AUDIO
        createAudio: builder.mutation({
            query: (data) => ({
                url: "/audio/create-audio",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["AUDIO"],
        }),

        // UPDATE AUDIO
        updateAudio: builder.mutation({
            query: ({ id, data }) => ({
                url: `/audio/update-audio/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["AUDIO"],
        }),

        // DELETE AUDIO
        deleteAudio: builder.mutation({
            query: (id) => ({
                url: `/audio/delete-audio/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["AUDIO"],
        }),

        // GIVE RATING AUDIO
        giveRatingAudio: builder.mutation({
            query: ({ id, data }) => ({
                url: `/audio/give-rating/${id}`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["AUDIO"],
        }),

        // TOGGLE FAVORITE AUDIO
        favoriteToggleAudio: builder.mutation({
            query: (audio) => ({
                url: `/audio-bookmark/add-delete/${audio._id}`,
                method: "POST",
            }),
            async onQueryStarted(audio, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    chattingApi.util.updateQueryData('getBookmarkAudio', undefined, (draft) => {
                        const index = draft.data.findIndex(b => b.audio._id === audio._id);
                        if (index !== -1) {
                            draft.data.splice(index, 1);
                        } else {
                            draft.data.unshift({ audio });
                        }
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
        }),

        // CREATE PLAYLIST
        createPlaylist: builder.mutation({
            query: (data) => ({
                url: "/playlist/create",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["AUDIO"],
        }),

        // UPDATE PLAYLIST
        updatePlaylist: builder.mutation({
            query: ({ id, data }) => ({
                url: `/playlist/update/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["AUDIO"],
        }),

        // DELETE PLAYLIST
        deletePlaylist: builder.mutation({
            query: (id) => ({
                url: `/playlist/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["AUDIO"],
        }),


    }),
})

export const {
    useGetAllTopicsQuery,
    useGetAllAudioQuery,
    useGetMyAudioQuery,
    useGetSingleAudioQuery,
    useGetBookmarkAudioQuery,
    useGetAllPlaylistQuery,
    useGetMyPlaylistQuery,
    useGetSinglePlaylistQuery,
    useCreateAudioMutation,
    useUpdateAudioMutation,
    useDeleteAudioMutation,
    useGiveRatingAudioMutation,
    useFavoriteToggleAudioMutation,
    useCreatePlaylistMutation,
    useUpdatePlaylistMutation,
    useDeletePlaylistMutation,
    useCheckAudioMutation,
} = chattingApi