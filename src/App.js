import { useEffect, useState } from 'react';
import './App.css';
import DailySummary2 from './DailySummary2';
import Image from './images/7280763.jpg';

function App() {
  const [weatherData, setWeatherData] = useState({
    location: 'Delhi, India',
    temperature: null,
    feelsLike: null,
    wind: null,
    humidity: null,
    main: '',
    dt: '',
  });
  const [error, setError] = useState('');

  // Function to fetch weather data
  const fetchWeather = async (city = 'Delhi') => {
    const apiKey = '18437445f3f6d472eb7d513722fbaea7'; // Your actual API key
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    const data = await response.json();
    if (response.ok) {
      setWeatherData({
        location: `${data.name}, ${data.sys.country}`,
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        wind: `${Math.round(data.wind.speed)} km/h`,
        humidity: `${data.main.humidity}%`,
        main: data.weather[0].main,
        dt: new Date(data.dt * 1000).toLocaleString(), // Converts UNIX timestamp to local date string
      });
      setError(''); // Clear error on successful fetch
    } else {
      setWeatherData({
        location: '',
        temperature: null,
        feelsLike: null,
        wind: null,
        humidity: null,
        main: '',
        dt: '',
      });
      setError(data.message); // Set error message from API response
    }
  };

  // Fetch weather data when the component mounts
  useEffect(() => {
    fetchWeather(); // Call with default city
  }, []);

  // Handle search functionality
  const handleSearch = (event) => {
    if (event.key === 'Enter') {
      const city = event.target.value.trim(); // Trim whitespace from input
      if (city) {
        fetchWeather(city); // Call fetchWeather with the city input
      }
    }
  };

  return (
    <div 
      style={{
        backgroundImage: `url({Image})`, // Path to your image in the public folder
        backgroundSize: 'cover',   // Ensures the background covers the entire viewport
        backgroundPosition: 'center',
        minHeight: '100vh',        // Makes sure the background image covers the full height of the viewport
        color: 'white',            // Text color to make content more readable on a background
        padding: '20px'            // Some padding to make the content look nicer
      }}
    >
      <h1>Weather Dashboard</h1>
      {/* <img src={Image}  ></img> */}
      <DailySummary2 />
    </div>
  );
}

export default App;

