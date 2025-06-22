import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import WeatherForeCast from './weather/weather-component'
import { AuthProvider } from './auth/AuthProvider'
import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react'
import { LoginRedirect } from './auth/LoginRedirect'

function App() {
  const [count, setCount] = useState(0)

    return (
        <>
            <AuthProvider>
                <AuthenticatedTemplate>
                    <div>
                        <a href="https://vite.dev" target="_blank">
                            <img src={viteLogo} className="logo" alt="Vite logo" />
                        </a>
                        <a href="https://react.dev" target="_blank">
                            <img src={reactLogo} className="logo react" alt="React logo" />
                        </a>
                    </div>
                    <h1>Vite + React</h1>
                    <div className="card">
                        <button onClick={() => setCount((count) => count + 1)}>
                            count is {count}
                        </button>
                        <p>
                            Edit <code>src/App.tsx</code> and save and update.
                        </p>
                    </div>
                    <WeatherForeCast></WeatherForeCast>
                    <p className="read-the-docs">
                        Click on the Vite and React logos to learn more
                    </p>
                </AuthenticatedTemplate>
                <UnauthenticatedTemplate>
                    <LoginRedirect />
                </UnauthenticatedTemplate>
            </AuthProvider>

        </>
    );
}
export default App
