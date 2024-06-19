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

function prepareHeaders(headers) {
    headers.set('accept', 'application/json');

    const token = getAccessToken();

    if (token) {
        headers.set('authorization', 'Bearer ' + token);
    }

    return headers;
}

const portierBaseUrl = import.meta.env.PORTIER_URL + 'api/';
const oidcAuthorityBaseUrl = import.meta.env.OIDC_AUTHORITY_URL;
const mqttProxyBaseUrl = import.meta.env.MQTT_PROXY_URL;

const authenticatedPortierBaseQuery = fetchBaseQuery({
    baseUrl: portierBaseUrl,
    prepareHeaders,
});

const authenticatedOidcAuthorityBaseQuery = fetchBaseQuery({
    baseUrl: oidcAuthorityBaseUrl,
    prepareHeaders,
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

export const authenticatedOidcAuthorityApiSlice = createApi({
    reducerPath: 'authenticatedOidcAuthorityApi',
    baseQuery: authenticatedOidcAuthorityBaseQuery,
    endpoints: builder => ({
        getUserInfo: query(builder)('oidc/v1/userinfo'),
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
    useGetUserInfoQuery,
} = authenticatedOidcAuthorityApiSlice;

export const {
    useGetStatusQuery,
} = anonymousMqttApiSlice;
