// WeatherComponent.jsx// WeatherComponent.jsx// WeatherComponent.jsx
import React from 'react';
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiDayThunderstorm } from 'react-icons/wi';
import moment from 'moment';

const WeatherComponent = ({
  location,
  temperature,
  condition,
  main,
  feelsLike,
  tempMin,
  tempMax,
  conditionTime,
}) => {
  // Function to render the weather icon based on condition
  const renderWeatherIcon = () => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return <WiDaySunny size={64} color="#FFD700" />;
      case 'cloudy':
        return <WiCloudy size={64} color="#B0C4DE" />;
      case 'rain':
        return <WiRain size={64} color="#1E90FF" />;
      case 'snow':
        return <WiSnow size={64} color="#ADD8E6" />;
      case 'thunderstorm':
        return <WiDayThunderstorm size={64} color="#FF6347" />;
      default:
        return <WiCloudy size={64} color="#B0C4DE" />;
    }
  };

  return (
    <div className="weather-container">
      <div className="weather-header">
        <h2>{location}</h2>
        <p>{moment().format('dddd, MMMM Do YYYY, h:mm A')}</p>
      </div>
      <div className="weather-body">
        {renderWeatherIcon()}
        <div className="weather-info">
          <h1>{temperature}°C</h1>
          <p>{condition}</p>
          <p><strong>Main:</strong> {main}</p>
          <p><strong>Feels Like:</strong> {feelsLike}°C</p>
          <p><strong>Min Temp:</strong> {tempMin}°C</p>
          <p><strong>Max Temp:</strong> {tempMax}°C</p>
          <p><strong>Dominant Condition Time:</strong> {conditionTime}</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherComponent;
