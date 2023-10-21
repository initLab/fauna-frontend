import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getAccessToken, isAccessTokenExpired } from '../hooks/useAuthStorage.js';
import { refreshTokenIfNeeded } from '../oauth.js';

const apiBaseUrl = import.meta.env.BACKEND_URL + 'api/';
const deviceApiBaseUrl = import.meta.env.DEVICE_BACKEND_URL + 'api/';

const anonymousBaseQuery = fetchBaseQuery({
    baseUrl: apiBaseUrl,
    prepareHeaders: headers => {
        headers.set('accept', 'application/json');

        return headers;
    },
});

const authenticatedBaseQuery = fetchBaseQuery({
    baseUrl: apiBaseUrl,
    prepareHeaders: headers => {
        headers.set('accept', 'application/json');

        const token = getAccessToken();

        if (token) {
            headers.set('authorization', 'Bearer ' + token);
        }

        return headers;
    },
});

const authenticatedDeviceBaseQuery = fetchBaseQuery({
    baseUrl: deviceApiBaseUrl,
    prepareHeaders: headers => {
        headers.set('accept', 'application/json');

        const token = getAccessToken();

        if (token) {
            headers.set('authorization', 'Bearer ' + token);
        }

        return headers;
    },
});

const authenticatedBaseQueryWithReauth = async (args, api, extraOptions) => {
    if (isAccessTokenExpired()) {
        await refreshTokenIfNeeded();
    }

    let result = await authenticatedBaseQuery(args, api, extraOptions);

    if (result?.error?.status === 401 && await refreshTokenIfNeeded()) {
        return authenticatedBaseQuery(args, api, extraOptions);
    }

    return result;
};

const authenticatedDeviceBaseQueryWithReauth = async (args, api, extraOptions) => {
    if (isAccessTokenExpired()) {
        await refreshTokenIfNeeded();
    }

    let result = await authenticatedDeviceBaseQuery(args, api, extraOptions);

    if (result?.error?.status === 401 && await refreshTokenIfNeeded()) {
        return authenticatedDeviceBaseQuery(args, api, extraOptions);
    }

    return result;
};

const query = builder => url => builder.query({
    query: () => url,
});

export const anonymousApiSlice = createApi({
    reducerPath: 'anonymousApi',
    baseQuery: anonymousBaseQuery,
    endpoints: builder => ({
        getPresentUsers: query(builder)('users/present'),
    }),
});

export const authenticatedApiSlice = createApi({
    reducerPath: 'authenticatedApi',
    baseQuery: authenticatedBaseQueryWithReauth,
    endpoints: builder => ({
        getCurrentUser: query(builder)('current_user'),
    }),
});

export const authenticatedDeviceApiSlice = createApi({
    reducerPath: 'authenticatedDeviceApi',
    baseQuery: authenticatedDeviceBaseQueryWithReauth,
    endpoints: builder => ({
        getDoors: query(builder)('doors'),
        deviceAction: builder.mutation({
            query: params => ({
                url: 'devices/' + params.deviceId + '/' + params.action,
                method: 'POST',
            }),
        }),
        getActionLog: builder.query({
            query: params => 'actionLog/' + params.offset + '/' + params.limit,
        }),
    }),
});

export const {
    useGetPresentUsersQuery,
} = anonymousApiSlice;

export const {
    useGetCurrentUserQuery,
} = authenticatedApiSlice;

export const {
    useGetDoorsQuery,
    useDeviceActionMutation,
    useGetActionLogQuery,
} = authenticatedDeviceApiSlice;
