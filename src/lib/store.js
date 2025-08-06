import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './features/slices/auth/authSlice';



const rootReducer = combineReducers({
    auth: authReducer,
});

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth'],
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
            }),
    });
    const persistor = persistStore(store);

    return { store, persistor };
};
