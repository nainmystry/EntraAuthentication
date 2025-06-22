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
    const account = msalInstance.getAllAccounts()[0];
    if(account)
    {
        try{
            const response = await msalInstance.acquireTokenSilent({
                ...silentRequest, 
                account: account
            });
            config.headers.Authorization = `Bearer ${response.accessToken}`;
        }
        catch (error) {
            console.error('Token acquisition failed', error);
            await msalInstance.loginRedirect(loginRequest);
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
                const account = msalInstance.getAllAccounts()[0];
                const response = await msalInstance.acquireTokenSilent({
                    ...silentRequest,
                    account: account
                });
                originalRequest.headers.Authorization = `Bearer ${response.accessToken}`;
                return apiClient(originalRequest);
            } catch (err) {
                console.error('Token refresh failed', err);
                await msalInstance.loginRedirect(loginRequest);
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
