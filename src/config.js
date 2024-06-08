import { WebStorageStateStore } from 'oidc-client-ts';

export const oidc = {
    authority: import.meta.env.OIDC_AUTHORITY_URL,
    client_id: import.meta.env.OIDC_CLIENT_ID,
    redirect_uri: window.location.protocol + '//' + window.location.host + import.meta.env.BASE_URL,
    scope: 'openid profile offline_access',
    onSigninCallback: () => {
        window.history.replaceState({}, document.title, window.location.pathname);
    },
    userStore: new WebStorageStateStore({
        store: window.localStorage,
    }),
};

export const sensors = {
    'sensors/big-room/temperature': {
        type: 'Temperature',
        label: 'Big room',
    },
    'sensors/small-room/temperature': {
        type: 'Temperature',
        label: 'Small room',
    },
    'sensors/kitchen/temperature': {
        type: 'Temperature',
        label: 'Kitchen',
    },
};

export const grafana = {
    dashboard: {
        id: 'SGAb0ZXMk',
        name: 'temperature-and-humidity',
    },
    panels: [4, 5, 10],
};
