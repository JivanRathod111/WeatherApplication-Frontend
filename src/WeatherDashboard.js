import React from "react";
import {
  Container,
  Typography,
  TextField,
  Box,
  Paper,
  Grid,
} from "@mui/material";
import { DateRange as DateRangeIcon } from "@mui/icons-material"; // Import Date icon

import {
  Search as SearchIcon,
  Map as MapIcon,
  Thermostat as ThermostatIcon,
  WindPower as WindPowerIcon,
  WbSunny as WbSunnyIcon,
  Cloud as CloudIcon,
} from "@mui/icons-material";

const WeatherDashboard = ({ weatherData, onSearch }) => {
  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Box sx={{ textAlign: "center", mb: 2 }}>
        <Typography variant="h4">Weather App</Typography>
        <WbSunnyIcon sx={{ fontSize: 40 }} />
      </Box>

      {/* Search bar row */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <TextField
          variant="outlined"
          placeholder="Search..."
          onKeyDown={onSearch}
          fullWidth
          InputProps={{
            endAdornment: <SearchIcon />,
          }}
        />
      </Box>
{/* Main Condition and Date */}

<Paper elevation={3} sx={{ padding: 2, borderRadius: 2, mt: 2, mb: 2 }}>
  <Typography variant="subtitle1" sx={{ mb: 1 }}>
    Main
  </Typography>
  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    {/* Main Condition */}
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <CloudIcon sx={{ fontSize: 40, mr: 1 }} />
      <Typography variant="h6">{weatherData.main}</Typography>
    </Box>
    
    {/* Date Icon and Date */}
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <DateRangeIcon sx={{ fontSize: 30, mr: 1 }} /> {/* Date Icon */}
       <Typography variant="h6">
        {new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())}
      </Typography>
    </Box>
  </Box>
</Paper>

      {/* Temperature Display */}
      <Paper elevation={3} sx={{ padding: 2, borderRadius: 2 }}>
        
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="subtitle1">Location</Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <MapIcon />
              <Typography variant="body1" sx={{ ml: 1 }}>
                {weatherData.location}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle1">Temperature</Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <ThermostatIcon />
              <Typography variant="body1" sx={{ ml: 1 }}>
                {weatherData.temperature}°C
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle1">Feels Like</Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <ThermostatIcon />
              <Typography variant="body1" sx={{ ml: 1 }}>
                {weatherData.feelsLike}°C
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle1">Wind</Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <WindPowerIcon />
              <Typography variant="body1" sx={{ ml: 1 }}>
                {weatherData.wind} km/h
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

     

      {/* Forecast Display */}
      <Box sx={{ mt: 2, textAlign: "center" }}>
        <Typography variant="h6">Forecast</Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
          <Typography variant="subtitle1">Min Temperature</Typography>
          <Typography variant="body1">{weatherData.minTemp}°C</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="subtitle1">Max Temperature</Typography>
          <Typography variant="body1">{weatherData.maxTemp}°C</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="subtitle1">Sunrise</Typography>
          <Typography variant="body1">{weatherData.sunrise}</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="subtitle1">Sunset</Typography>
          <Typography variant="body1">{weatherData.sunset}</Typography>
        </Box>
      </Box>
    </Container>
  );
};

// Sample static data for weatherData prop
const weatherData = {
  location: "New York, NY",
  temperature: 22,
  feelsLike: 24,
  wind: 15,
  minTemp: 18,
  maxTemp: 25,
  sunrise: "6:30 AM",
  sunset: "6:00 PM",
  condition: "Haze", // Add the main weather condition here
};

// Example onSearch function
const onSearch = (event) => {
  if (event.key === "Enter") {
    // Handle search logic here
    console.log("Searching for:", event.target.value);
  }
};

// Exporting component
export default WeatherDashboard;
