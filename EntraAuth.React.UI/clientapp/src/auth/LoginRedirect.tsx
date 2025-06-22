import { useMsal } from "@azure/msal-react"
import { useEffect } from "react";
import { loginRequest } from "./authConfig";
import { setActiveAccount } from "./authUtils";


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
                //await instance.loginRedirect(loginRequest);
                const response = await instance.loginPopup({
                    scopes: ["User.Read"]                    
                });
                setActiveAccount(response.account);
            } catch (error) {
                console.error('Login redirect failed', error);
                instance.loginRedirect(loginRequest);
            }
        };

        initiateLogin();
    }, [instance]);


    return (<h1>Login Redirect Page</h1>);
}