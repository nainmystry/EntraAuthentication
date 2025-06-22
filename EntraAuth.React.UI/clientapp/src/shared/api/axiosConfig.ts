import { PublicClientApplication } from '@azure/msal-browser';
import axios from 'axios';
import { loginRequest, msalConfig, silentRequest } from '../../auth/authConfig';

/**
 * Axios instance with base configuration to use it for API calls.
 */
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL, //get from env constants or appsettings.
    timeout: 10000,
    headers:{
        'Content-Type': 'application/json'
    }    
});


/*
For api calls, the token will be used from here, instead of showing a popup
*/
const msalInstance = new PublicClientApplication(msalConfig);


/**
 * Interceptor to add bearer token to requests
 */
apiClient.interceptors.request.use(async (config) => {
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length > 0) {
        try {
            const response = await msalInstance.acquireTokenSilent({
                ...silentRequest,
                account: accounts[0]
            });
            config.headers.Authorization = `Bearer ${response.accessToken}`;
        } catch (error) {
            console.error('Silent token failed, trying popup:', error);
            try {
                const response = await msalInstance.acquireTokenPopup(silentRequest);
                config.headers.Authorization = `Bearer ${response.accessToken}`;
            } catch (popupError) {
                console.error('Popup token failed:', popupError);
                await msalInstance.loginPopup(loginRequest);
            }
        }
    }
    return config;
});

/**
 * Interceptor to handle 401 errors and refresh token
 */
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401) {
            //originalRequest._retry = true;
            try {
                const accounts = msalInstance.getAllAccounts();
                if (accounts.length > 0) {
                    const response = await msalInstance.acquireTokenSilent({
                        ...silentRequest,
                        account: accounts[0]
                    });
                    originalRequest.headers.Authorization = `Bearer ${response.accessToken}`;
                    return apiClient(originalRequest);
                }
                else {
                    await msalInstance.loginPopup(loginRequest);
                }
            } catch (err) {
                console.error('Token refresh failed', err);
                await msalInstance.loginPopup(loginRequest);
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
