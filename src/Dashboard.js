
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
    // State variables for storing weather data
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState(null);

    // Replace with your OpenWeatherMap API key and desired city
    const API_KEY = '18437445f3f6d472eb7d513722fbaea7';
    const CITY = 'Delhi';
    
    // Backend endpoint where data will be posted
    const BACKEND_URL = 'http://localhost:8080/api/weather'; // Replace with your backend URL

    // Fetch weather data function
    const fetchWeatherData = async () => {
        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}`
            );
            
            // Extract the relevant data
            const { main, weather, dt } = response.data;
            const weatherInfo = {
                main: weather[0].main,           // Main weather condition (e.g., Rain, Clear)
                feelsLike: main.feels_like - 273.15, // Convert Kelvin to Celsius
                temp: main.temp - 273.15,       // Convert Kelvin to Celsius
                dt: new Date(dt * 1000),        // Convert cd timestamp to Date
            };

            setWeatherData(weatherInfo);

            // Post the weather data to the backend
            await postWeatherData(weatherInfo);

        } catch (error) {
            setError('Error fetching weather data');
            console.error('Error fetching weather data:', error);
        }
    };

    // Function to post weather data to the backend
    const postWeatherData = async (data) => {
        try {
            await axios.post(BACKEND_URL, data);
            console.log('Weather data posted successfully:', data);
        } catch (error) {
            console.error('Error posting weather data:', error);
        }
    };

    // Use effect to fetch data when the component mounts
    useEffect(() => {
        fetchWeatherData();
    }, []); // Empty dependency array means this runs once when the component mounts

    return (
        <div>
            <h2>Weather Information for {CITY}</h2>
            {error && <p>{error}</p>}
            {weatherData ? (
                <div>
                    <p>Main Condition: {weatherData.main}</p>
                    <p>Feels Like: {weatherData.feelsLike.toFixed(2)}°C</p>
                    <p>Temperature: {weatherData.temp.toFixed(2)}°C</p>
                    <p>Date and Time: {weatherData.dt.toString()}</p>
                </div>
            ) : (
                <p>Loading weather data...</p>
            )}
        </div>
    );
};

export default Dashboard;
