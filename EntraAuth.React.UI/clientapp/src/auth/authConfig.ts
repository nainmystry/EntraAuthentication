import { BrowserCacheLocation, type Configuration, LogLevel } from "@azure/msal-browser";

const clientId = import.meta.env.VITE_AZURE_CLIENT_ID
const authority = import.meta.env.VITE_AZURE_TENANT_ID


export const msalConfig: Configuration = {
    auth: {
        clientId: clientId, //will get this after app-registration, can take this value from appconstants or appsettings
        authority: "https://login.microsoftonline.com/${authority}", //will get this after app-registration, can take this value from appconstants or appsettings
        redirectUri: "/", // or give only / as path or update the HomeComponent Path
        postLogoutRedirectUri: "/" // or give only / as path or route to login (optional)
    },
    cache: {
        cacheLocation: "sessionStorage", // This configures where your cache will be stored
        storeAuthStateInCookie: false, 
    },
    system: { //optional setting for logging, etc details.
        loggerOptions: {
            loggerCallback: (level, message, containsPii) => {
                if (containsPii) return;
                console.log(`MSAL: ${message} ${level}`);
            },
            logLevel: LogLevel.Verbose
        }
    }
}

// Add here the endpoints for MS Graph API services you would like to use (If any)
//export const graphConfig = {
//    graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me'
//};

/**
 * Scopes required for authentication
 * Add additional API scopes here if needed
 */
export const loginRequest = {
    scopes: [
        'openid', //for basic claims
            'profile', // for user email id and info
            'User.Read']
};

/**
 * Configuration for token refresh
 */
export const silentRequest = {
    scopes: ['openid', 'profile', 'User.Read'],
    forceRefresh: false
};