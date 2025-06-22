import { useEffect } from 'react'
import './App.css'
import WeatherForeCast from './weather/weather-component'
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react'
import { LoginRedirect } from './auth/LoginRedirect'
import { loginRequest } from './auth/authConfig'
import { setActiveAccount } from './auth/authUtils'

function App() {

    const { instance, accounts } = useMsal();

    useEffect(() => {
        const authenticate = async () => {
            await instance.initialize(); // ? Wait for MSAL to initialize

            if (accounts.length > 0) {
                setActiveAccount(accounts[0]);
            } else {
                try {
                    const response = await instance.loginPopup(loginRequest);
                    setActiveAccount(response.account);
                } catch (error) {
                    console.error("Login failed:", error);
                    instance.loginRedirect(loginRequest);
                }
            }
        };

        authenticate();
    }, [accounts, instance]);

    return (
        <>
            <AuthenticatedTemplate>
                <h1>Vite + React</h1>
                <WeatherForeCast></WeatherForeCast>
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
                <LoginRedirect></LoginRedirect>
            </UnauthenticatedTemplate>
        </>       
    );
}
export default App
