import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';

function App() {
  const [data, setData] = useState({});
  const [forecastData, setForecastData] = useState([]);
  const [location, setLocation] = useState('');

  const apiKey = '895284fb2d2c50a520ea537456963d9c';
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`;

  const searchLocation = (event) => {
    if (event.key === 'Enter') {
      axios.get(weatherUrl).then((response) => {
        setData(response.data);
        const { lat, lon } = response.data.coord;

        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

        axios.get(forecastUrl).then((response) => {
          const dailyForecast = response.data.list.filter(forecast =>
            forecast.dt_txt.includes("12:00:00")
          );
          setForecastData(dailyForecast);
        });
      });

      setLocation('');
    }
  };

  const formatDate = (date) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  return (
    <div className="app">
      <div className="search">
        <input
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          onKeyPress={searchLocation}
          placeholder="Enter Location"
          type="text"
        />
      </div>

      <div className="container">
      {data.name !== undefined &&(
        <div className="top">
          <div className="location">
            <p>{data.name}</p>
          </div>
          <div className="temp">
            {data.main ? <h1>{data.main.temp.toFixed()}°C</h1> : null}
          </div>
          <div className="description">
            {data.weather ? <p>{data.weather[0].main}</p> : null}
          </div>
        </div>
      )}

        {data.name !== undefined &&(
          <div className="future-forecast">
            <div className="weather-forecast" id="weather-forecast">
            {forecastData.map((forecast, index) => (
              <div key={index} className="weather-forecast-item">
                <div className="day">{formatDate(forecast.dt_txt)}</div>
                <img
                  src={`http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
                  alt="weather icon"
                  className="w-icon"/>
                <div className="temp">Min- {forecast.main.temp_min.toFixed()}°C</div>
                <div className="temp">Max - {forecast.main.temp_max.toFixed()}°C</div>
              </div>
            ))}
          </div>
        </div>
        )}

        {data.name !== undefined && (
          <div className="bottom">
            <div className="feels">
              {data.main ? <p className="bold">{data.main.feels_like.toFixed()}°C</p> : null}
              <p>Feels Like</p>
            </div>
            <div className="humidity">
              {data.main ? <p className="bold">{data.main.humidity}%</p> : null}
              <p>Humidity</p>
            </div>
            <div className="wind">
              {data.wind ? <p className="bold">{data.wind.speed.toFixed()} kmph</p> : null}
              <p>Wind Speed</p>
            </div>
            <div className="Sunrise">
              <p className="bold">{moment(data.sys.sunrise * 1000).format('hh:mm a')}</p>
              <p>Sunrise</p>
            </div>
            <div className="Sunset">
              <p className="bold">{moment(data.sys.sunset * 1000).format('hh:mm a')}</p>
              <p>Sunset</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
