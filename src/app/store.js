import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { anonymousMqttApiSlice, anonymousPresenceApiSlice, authenticatedPortierApiSlice } from '../features/apiSlice';

export const store = configureStore({
    reducer: {
        [authenticatedPortierApiSlice.reducerPath]: authenticatedPortierApiSlice.reducer,
        [anonymousPresenceApiSlice.reducerPath]: anonymousPresenceApiSlice.reducer,
        [anonymousMqttApiSlice.reducerPath]: anonymousMqttApiSlice.reducer,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(authenticatedPortierApiSlice.middleware)
            .concat(anonymousPresenceApiSlice.middleware).concat(anonymousMqttApiSlice.middleware),
});

setupListeners(store.dispatch);
