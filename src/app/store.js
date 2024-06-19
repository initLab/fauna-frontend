import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import {
    anonymousMqttApiSlice,
    authenticatedOidcAuthorityApiSlice,
    authenticatedPortierApiSlice,
} from '../features/apiSlice';

export const store = configureStore({
    reducer: {
        [authenticatedPortierApiSlice.reducerPath]: authenticatedPortierApiSlice.reducer,
        [authenticatedOidcAuthorityApiSlice.reducerPath]: authenticatedOidcAuthorityApiSlice.reducer,
        [anonymousMqttApiSlice.reducerPath]: anonymousMqttApiSlice.reducer,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(authenticatedPortierApiSlice.middleware)
            .concat(authenticatedOidcAuthorityApiSlice.middleware).concat(anonymousMqttApiSlice.middleware),
});

setupListeners(store.dispatch);
