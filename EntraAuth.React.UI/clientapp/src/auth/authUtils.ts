import { PublicClientApplication, type AccountInfo } from '@azure/msal-browser';
import { msalConfig } from './authConfig';

const msalInstance = new PublicClientApplication(msalConfig);

/**
 * Sets the active account after login
 * @param account The account to set as active
 */
export const setActiveAccount = (account: AccountInfo | null) => {
    msalInstance.setActiveAccount(account);
};

/**
 * Gets the active account
 * @returns The currently active account or null
 */
export const getActiveAccount = (): AccountInfo | null => {
    return msalInstance.getActiveAccount();
};

/**
 * Handles redirect promise and sets active account
 */
export const handleRedirectPromise = async () => {
    try {
        const authResult = await msalInstance.handleRedirectPromise();
        if (authResult && authResult.account) {
            setActiveAccount(authResult.account);
        }
        return authResult;
    } catch (error) {
        console.error('Redirect promise handling failed:', error);
        throw error;
    }
};