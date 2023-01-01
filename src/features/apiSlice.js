import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {getToken} from '../authStorage.js';

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

const postWithBody = url => params => ({
    url: url,
    method: 'POST',
    body: params,
});

const mutationPostWithBody = builder => url => builder.mutation({
    query: postWithBody(url),
});

export const anonymousApiSlice = createApi({
    reducerPath: 'anonymousApi',
    baseQuery: anonymousBaseQuery,
    endpoints: builder => ({
        getPresentUsers: query(builder)('api/users/present'),
        // TODO
        login: mutationPostWithBody(builder)('login'),
    }),
});

export const authenticatedApiSlice = createApi({
    reducerPath: 'authenticatedApi',
    baseQuery: authenticatedBaseQuery,
    endpoints: builder => ({
        getCurrentUser: query(builder)('api/current_user'),
    }),
});

export const {
    useGetPresentUsersQuery,
    useLoginMutation,
} = anonymousApiSlice;

export const {
    useGetCurrentUserQuery,
} = authenticatedApiSlice;
