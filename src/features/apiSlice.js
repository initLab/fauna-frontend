import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getToken } from '../authStorage.js';

const anonymousBaseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL,
    prepareHeaders: headers => {
        headers.set('accept', 'application/json');

        return headers;
    },
});

const authenticatedBaseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL,
    prepareHeaders: headers => {
        headers.set('accept', 'application/json');

        const token = getToken();

        if (token) {
            headers.set('authorization', 'Bearer ' + token);
        }

        return headers;
    },
});

const query = builder => url => builder.query({
    query: () => url,
});

export const anonymousApiSlice = createApi({
    reducerPath: 'anonymousApi',
    baseQuery: anonymousBaseQuery,
    endpoints: builder => ({
        getPresentUsers: query(builder)('api/users/present'),
    }),
});

export const authenticatedApiSlice = createApi({
    reducerPath: 'authenticatedApi',
    baseQuery: authenticatedBaseQuery,
    endpoints: builder => ({
        getDoors: query(builder)('api/doors.json'),
        doorAction: builder.mutation({
            query: params => ({
                url: 'api/doors/' + params.doorId + '/' + params.action,
                method: 'POST',
            }),
        }),
    }),
});

export const {
    useGetPresentUsersQuery,
} = anonymousApiSlice;

export const {
    useGetDoorsQuery,
    useDoorActionMutation,
} = authenticatedApiSlice;
