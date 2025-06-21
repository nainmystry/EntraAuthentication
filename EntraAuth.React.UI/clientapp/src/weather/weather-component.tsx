/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import type { WeatherForecast } from "../models/WeatherForecast";
import { weatherService } from "../services/WeatherService";


const WeatherForeCast: React.FC = () => {
    const [forecasts, setForecasts] = useState<WeatherForecast[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await weatherService.getForecasts();
                setForecasts(data);
            } catch (e) {
                setError('Something went wrong');
                console.error(e);
            }
            finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    
    return (
        <div>
            <h2>Weather Forecast</h2>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>°C</th>
                        <th>°F</th>
                        <th>Summary</th>
                    </tr>
                </thead>
                <tbody>
                    {forecasts.map((forecast, index) => (
                        <tr key={index}>
                            <td>{forecast.date}</td>
                            <td>{forecast.temperatureC}</td>
                            <td>{forecast.temperatureF}</td>
                            <td>{forecast.summary || 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};