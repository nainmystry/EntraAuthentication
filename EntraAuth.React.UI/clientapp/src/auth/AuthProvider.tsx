import { type ReactNode } from 'react';

import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from './authConfig';

/**
 * Creates MSAL PublicClientApplication instance for UI auth flows when app is opened.
 */
const pca = new PublicClientApplication(msalConfig);

interface AuthProviderProps{
    children: ReactNode;
}

/**
 * Provides MSAL context to child components
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
    return (
        <MsalProvider instance={pca}>
            {children}
        </MsalProvider>        
    );
};
