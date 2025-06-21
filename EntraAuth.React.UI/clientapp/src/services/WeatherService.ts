import type { WeatherForecast } from "../models/WeatherForecast";
import apiClient from "../shared/api/axiosConfig";


class WeatherService{     
    async getForecasts(): Promise<WeatherForecast[]> {
        const response = await apiClient.get<WeatherForecast[]>('/weatherforecast');
        return response.data;
    }

    // Add other API methods here:
    async getExtendedForecast(): Promise<WeatherForecast[]> {
        const response = await apiClient.get<WeatherForecast[]>('/weatherforecast/extended');
        return response.data;
    }
}
export const weatherService = new WeatherService();
//gets a singleton instance.