import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './features/slices/auth/authSlice';
import audioReducer from './features/slices/audio/audioSlice';
import mediaReducer from './features/slices/media/mediaSlice';
import { baseApi } from './features/api/baseApi';



const rootReducer = combineReducers({
    auth: authReducer,
    audio: audioReducer,
    media: mediaReducer,
    [baseApi.reducerPath]: baseApi.reducer,
});

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth', 'audio'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
    const store = configureStore({
        reducer: persistedReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: {
                    ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
                },
            }).concat(baseApi.middleware),
    });
    const persistor = persistStore(store);

    return { store, persistor };
};

export const persistor = makeStore().persistor;""
