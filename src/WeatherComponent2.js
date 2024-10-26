import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WeatherComponent = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState(null);

    // Fetch weather data from the backend
    const fetchWeatherData = async () => {
        try {
            const response = await axios.get('http://localhost:8051/api/weather');
            console.log(response.data);
            setWeatherData(response.data);
        } catch (err) {
            setError('Error fetching weather data');
            console.error(err);
        }
    };

    // Post weather data to the backend to save in the database
    const saveWeatherData = async () => {
        if (!weatherData) {
            console.error('No weather data to save');
            return;
        }
        try {
            await axios.post('http://localhost:8051/api/weather', weatherData);
            console.log('Weather data saved successfully');
        } catch (err) {
            console.error('Error saving weather data', err);
        }
    };

    // Function to periodically fetch and save data every 5 minutes
    const startWeatherMonitoring = () => {
        // Fetch and save data immediately on component mount
        fetchWeatherData().then(() => saveWeatherData());

        // Set an interval to repeat every 5 minutes (300000 ms)
        const intervalId = setInterval(() => {
            fetchWeatherData().then(() => saveWeatherData());
        }, 300000);

        // Clear interval on component unmount
        return () => clearInterval(intervalId);
    };

    useEffect(() => {
        // Start weather monitoring
        const cleanup = startWeatherMonitoring();

        // Cleanup function to stop interval when component unmounts
        return cleanup;
    }, []);

    return (
        <div>
            <h2>Weather Information</h2>
            {error && <p>{error}</p>}
            {weatherData ? (
                <div>
                    <p><strong>Main:</strong> {weatherData.main}</p>
                    <p><strong>Feels Like:</strong> {weatherData.feelsLike.toFixed(2)}°C</p>
                    <p><strong>Temperature:</strong> {weatherData.temp.toFixed(2)}°C</p>
                    <p><strong>Minimum Temperature:</strong> {weatherData.temp_min.toFixed(2)}°C</p>
                    <p><strong>Maximum Temperature:</strong> {weatherData.temp_max.toFixed(2)}°C</p>
                    <p><strong>Average Temperature:</strong> {weatherData.averageTemperature.toFixed(2)}°C</p>
                    <p><strong>Dominant Condition:</strong> {weatherData.dominantCondition}</p>
                    <p><strong>Time:</strong> {new Date(weatherData.dt * 1000).toString()}</p>

                    <button onClick={saveWeatherData}>Save Weather Data</button>
                </div>
            ) : (
                <p>Loading weather data...</p>
            )}
        </div>
    );
};

export default WeatherComponent;
