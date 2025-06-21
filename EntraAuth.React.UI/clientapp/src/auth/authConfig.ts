import { BrowserCacheLocation, type Configuration, LogLevel } from "@azure/msal-browser";


export const msalConfig: Configuration = {
    auth: {
        clientId: "enter client-id", //will get this after app-registration
        authority: "", //will get this after app-registration
        redirectUri: window.location.origin, // or give only / as path
        postLogoutRedirectUri: window.location.origin // or give only / as path
    },
    cache: {
        cacheLocation: BrowserCacheLocation.LocalStorage,
        storeAuthStateInCookie: false        
    },
    system: { //optional setting for logging, etc details.
        loggerOptions: {
            loggerCallback: (level, message, containsPii) => {
                if (containsPii) return;
                console.log(`MSAL: ${message}`);
            },
            logLevel: LogLevel.Info
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
    scopes: ['openid', //for basic claims
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