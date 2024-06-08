import { oidc as oidcConfig } from '../config.js';
import { User } from 'oidc-client-ts';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

function getAccessToken() {
    const oidcStorage = localStorage.getItem(`oidc.user:${oidcConfig.authority}:${oidcConfig.client_id}`)

    if (!oidcStorage) {
        return null;
    }

    const user = User.fromStorageString(oidcStorage);

    return user?.access_token;
}

const portierBaseUrl = import.meta.env.PORTIER_URL + 'api/';
const presenceBaseUrl = import.meta.env.OIDC_AUTHORITY_URL + 'api/';
const mqttProxyBaseUrl = import.meta.env.MQTT_PROXY_URL;

const authenticatedPortierBaseQuery = fetchBaseQuery({
    baseUrl: portierBaseUrl,
    prepareHeaders: headers => {
        headers.set('accept', 'application/json');

        const token = getAccessToken();

        if (token) {
            headers.set('authorization', 'Bearer ' + token);
        }

        return headers;
    },
});

const anonymousPresenceBaseQuery = fetchBaseQuery({
    baseUrl: presenceBaseUrl,
    prepareHeaders: headers => {
        headers.set('accept', 'application/json');

        return headers;
    },
});

const anonymousMqttProxyBaseQuery = fetchBaseQuery({
    baseUrl: mqttProxyBaseUrl,
});


const query = builder => url => builder.query({
    query: () => url,
});

export const authenticatedPortierApiSlice = createApi({
    reducerPath: 'authenticatedPortierApi',
    baseQuery: authenticatedPortierBaseQuery,
    endpoints: builder => ({
        getDevices: query(builder)('devices'),
        deviceAction: builder.mutation({
            query: params => ({
                url: 'device/' + params.deviceId + '/' + params.action,
                method: 'POST',
            }),
        }),
        getActionLog: builder.query({
            query: params => 'actionLog/' + params.offset + '/' + params.limit,
        }),
    }),
});

export const anonymousPresenceApiSlice = createApi({
    reducerPath: 'anonymousApi',
    baseQuery: anonymousPresenceBaseQuery,
    endpoints: builder => ({
        getPresentUsers: query(builder)('users/present'),
    }),
});

export const anonymousMqttApiSlice = createApi({
    reducerPath: 'anonymousMqttApi',
    baseQuery: anonymousMqttProxyBaseQuery,
    endpoints: builder => ({
        getStatus: query(builder)('status'),
    }),
});

export const {
    useGetDevicesQuery,
    useDeviceActionMutation,
    useGetActionLogQuery,
} = authenticatedPortierApiSlice;

export const {
    useGetPresentUsersQuery,
} = anonymousPresenceApiSlice;

export const {
    useGetStatusQuery,
} = anonymousMqttApiSlice;
