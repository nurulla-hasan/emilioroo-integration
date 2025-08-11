import { baseApi } from "./baseApi";



const chattingApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // GET ALL AUDIO
        getAllAudio: builder.query({
            query: () => ({
                url: "/audio/all-audios",
                method: "GET",
            }),
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
            query: () => ({
                url: "/playlist/all-playlists",
                method: "GET",
            }),
            providesTags: ["AUDIO"],
        }),

        // GET MY PLAYLIST
        getMyPlaylist: builder.query({
            query: () => ({
                url: "/playlist/my-playlists",
                method: "GET",
            }),
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

        // ADD AND DELETE BOOKMARK AUDIO
        deleteBookmarkAudio: builder.mutation({
            query: (id) => ({
                url: `/audio-bookmark/add-delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["AUDIO"],
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
    useDeleteBookmarkAudioMutation,
    useCreatePlaylistMutation,
    useUpdatePlaylistMutation,
    useDeletePlaylistMutation,
} = chattingApi