import { useMsal } from "@azure/msal-react"
import { useEffect } from "react";
import { loginRequest } from "./authConfig";


/**
 * Handles redirect login flow
 * Automatically triggers Azure AD login when rendered
 */
export const LoginRedirect = () => {
    const { instance } = useMsal();

    useEffect(() => {
        /**
         * Initiates Azure AD login redirect
         */
        const initiateLogin = async () => {
            try {
                await instance.loginRedirect(loginRequest);
            } catch (error) {
                console.error('Login redirect failed', error);
            }
        };

        initiateLogin();
    }, [instance]);
}