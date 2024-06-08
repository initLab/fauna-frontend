import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { BrowserRouter } from 'react-router-dom';
import { oidc as oidcConfig } from './config';
import { AuthProvider } from 'react-oidc-context';

import './i18n';
import App from './App';

import '@fortawesome/fontawesome-free/css/all.css';
import 'bootswatch/dist/materia/bootstrap.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter basename={import.meta.env.BASE_URL}>
                <AuthProvider {...oidcConfig}>
                    <App />
                </AuthProvider>
            </BrowserRouter>
        </Provider>
    </React.StrictMode>,
);
