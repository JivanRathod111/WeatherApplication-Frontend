import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Grid, TextField } from "@mui/material";
import axios from "axios";

// Function to fetch weather data from OpenWeather API
const fetchWeather = async (city = "Delhi") => {
  const apiKey = "18437445f3f6d472eb7d513722fbaea7"; // Replace with your actual API key
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching weather data", error);
    return null;
  }
};

// Function to get the current date in 'YYYY-MM-DD' format
const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const DailySummary = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");
  const [city, setCity] = useState("Delhi"); // Default city
  const [dailySummaries, setDailySummaries] = useState();

  // Function to handle weather fetch and update daily summaries
  const updateWeatherSummary = async () => {
    const data = await fetchWeather(city);
    if (data) {
      const weatherSummary = {
        location: `${data.name}, ${data.sys.country}`,
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        wind: `${Math.round(data.wind.speed)} km/h`,
        humidity: `${data.main.humidity}%`,
        main: data.weather[0].main,
        dt: getCurrentDate(), // Get today's date
        city: data.name, // Extracted city name
        country: data.sys.country, // Extracted country code
      };
      setWeatherData(weatherSummary);
      setError("");

      // Fetch daily summaries for the current city and today's date
      const currentDate = getCurrentDate(); // Get today's date dynamically
      const existingSummary = await fetchDailySummaries(
        weatherSummary.city,
        currentDate
      ); // Use the extracted city
      if (existingSummary) {
        // Update daily summary based on current weather
        await updateDailySummaryWithWeather(existingSummary, weatherSummary);
      } else {
        // Create a new daily summary if none exists
        await createDailySummary(weatherSummary);
      }
    } else {
      setError("Error fetching weather data.");
    }
  };

  // Function to fetch daily summaries from the database
  const fetchDailySummaries = async (city, date) => {
    try {
      const response = await axios.get(
        `http://localhost:8051/dailySummary?city=${city}&date=${date}`
      ); // Adjust API endpoint as needed
      setDailySummaries(response.data);
      return response.data; // Return the fetched daily summary
    } catch (error) {
      console.error("Error fetching daily summaries from database", error);
      return null; // Return null if error occurs
    }
  };

  // Function to create a new daily summary in your database
  const createDailySummary = async (summary) => {
    const newSummary = {
      city: summary.city,
      date: summary.dt, // Ensure we are using the formatted date here
      dominantCondition: summary.main, // Assuming you want to use the main condition as dominant
      averageTemperature: summary.temperature, // Start with current temperature as average
      maximumTemperature: summary.temperature, // Start with current temperature as maximum
      minimumTemperature: summary.temperature, // Start with current temperature as minimum
    };

    try {
      await axios.post(`http://localhost:8051/dailySummary`, newSummary); // Adjust API endpoint as needed
      setDailySummaries(newSummary); // Update the state with the new summary
    } catch (error) {
      console.error("Error creating new daily summary in database", error);
    }
  };

  // Function to update daily summary in your database (assuming a backend endpoint exists)
  const updateDailySummaryInDatabase = async (summary) => {
    try {
      await axios.put(
        `http://localhost:8051/${summary.city}/${summary.date}`,
        summary
      ); // Adjust API endpoint as needed
    } catch (error) {
      console.error("Error updating daily summary in database", error);
      console.log(summary);
    }
  };

  // Function to update daily summary with current weather data
  const updateDailySummaryWithWeather = async (
    existingSummary,
    currentWeather
  ) => {
    let { averageTemperature, maximumTemperature, minimumTemperature } =
      existingSummary;

    // Check current temperature against existing min and max temperatures
    if (currentWeather.temperature < minimumTemperature) {
      minimumTemperature = currentWeather.temperature; // Update min if current temp is lower
    }
    if (currentWeather.temperature > maximumTemperature) {
      maximumTemperature = currentWeather.temperature; // Update max if current temp is higher
    }

    // Calculate average temperature (simple average)
    averageTemperature = (minimumTemperature + maximumTemperature) / 2;

    // Update existing summary
    const updatedSummary = {
      ...existingSummary,
      averageTemperature,
      maximumTemperature,
      minimumTemperature,
    };

    // Update the database with the new summary
    await updateDailySummaryInDatabase(updatedSummary);
    setDailySummaries(updatedSummary); // Update the state with the new summary
  };

  // Run weather fetch every 5 minutes (300,000ms) and update daily summaries on mount
  useEffect(() => {
    updateWeatherSummary(); // Fetch on mount
    const intervalId = setInterval(updateWeatherSummary, 300000); // Every 5 minutes

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [city]); // Depend on city to re-fetch when it changes

  // Handle search functionality
  const handleSearch = (event) => {
    if (event.key === "Enter") {
      const newCity = event.target.value.trim();
      if (newCity) {
        setCity(newCity);
        updateWeatherSummary(); // Update the weather and summaries for the new city
      }
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom color="primary">
        Daily Weather Summary
      </Typography>

      {/* Weather Search */}
      <TextField
        label="Enter City"
        variant="outlined"
        onKeyPress={handleSearch}
        style={{ marginBottom: "20px", width: "100%" }}
      />

      {/* Current Weather Summary */}
      {weatherData && (
        <Card style={{ marginBottom: "20px", backgroundColor: "#e0f7fa" }}>
          <CardContent>
            <Typography variant="h5" color="textSecondary">
              {weatherData.location}
            </Typography>
            <Typography variant="h3" color="textPrimary">
              {weatherData.temperature}°C
            </Typography>
            <Typography variant="subtitle1">
              Feels like: {weatherData.feelsLike}°C
            </Typography>
            <Typography variant="subtitle1">
              Wind: {weatherData.wind} | Humidity: {weatherData.humidity}
            </Typography>
            <Typography variant="subtitle1">
              Condition: {weatherData.main}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Last Updated: {weatherData.dt}
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Display One Daily Summary */}
      <Typography variant="h5" gutterBottom color="secondary">
        Today's Daily Summary
      </Typography>
      {dailySummaries != null ? (
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Card style={{ backgroundColor: "#ffecb3" }}>
              <CardContent>
                <Typography variant="h6">
                  City: {dailySummaries.city}
                </Typography>
                <Typography variant="h6">
                  Dominant Condition: {dailySummaries.dominantCondition}
                </Typography>
                <Typography variant="h6">
                  Average Temperature: {dailySummaries.averageTemperature}°C
                </Typography>
                <Typography variant="h6">
                  Maximum Temperature: {dailySummaries.maximumTemperature}°C
                </Typography>
                <Typography variant="h6">
                  Minimum Temperature: {dailySummaries.minimumTemperature}°C
                </Typography>
                <Typography variant="h6">
                  Date: {dailySummaries.date}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Typography variant="body1" color="textSecondary">
          No daily summaries available for today.
        </Typography>
      )}

      {/* Error Handling */}
      {error && (
        <Typography variant="body1" color="error" style={{ marginTop: "20px" }}>
          {error}
        </Typography>
      )}
    </div>
  );
};

export default DailySummary;
