 export class WeatherForecast {
  //id!: number;
  date!: string; // DateOnly serializes to string
  temperatureC!: number;
  temperatureF!: number; // Calculated by backend
  summary!: string | null; // Matches C#'s string?
}