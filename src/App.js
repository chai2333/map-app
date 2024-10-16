import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CityInput from './components/CityInput';
import StaticMap from './components/StaticMap';
import './App.css';

const App = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [cityData, setCityData] = useState(null);
  const [aqiData, setAqiData] = useState(null); // 空气质量数据
  const [newsData, setNewsData] = useState([]); // 地方新闻数据
  const [error, setError] = useState(null);
  const [center, setCenter] = useState({ lng: 116.41, lat: 39.92 }); // 设置默认中心点为北京

  const handleCityChange = (newCity) => {
    setCity(newCity);
    setError(null);
    setCityData(null);
    setWeatherData(null);
    setForecastData(null);
    setAqiData(null);
    setNewsData([]); // 重置新闻数据
  };

  // 更新地图中心点
  useEffect(() => {
    if (city) {
      const fetchCenterData = async () => {
        try {
          const response = await axios.get(
            `https://restapi.amap.com/v3/geocode/geo?address=${city}&key=f1995c0eece64ff8065cd2df54cfe3af`
          );
          const location = response.data.geocodes[0].location.split(',');
          setCenter({ lng: parseFloat(location[0]), lat: parseFloat(location[1]) });
        } catch (err) {
          setError('无法获取城市位置数据');
        }
      };
      fetchCenterData();
    }
  }, [city]);

  // 获取城市简介
  useEffect(() => {
    if (city) {
      const fetchCityData = async () => {
        try {
          const response = await axios.get(`https://zh.wikipedia.org/api/rest_v1/page/summary/${city}`);
          setCityData(response.data);
        } catch (err) {
          setError('未找到该城市的信息');
        }
      };
      fetchCityData();
    }
  }, [city]);

  // 获取天气信息
  useEffect(() => {
    if (city) {
      const fetchWeatherData = async () => {
        try {
          const weatherResponse = await axios.get(
            `https://restapi.amap.com/v3/weather/weatherInfo?city=${city}&key=f1995c0eece64ff8065cd2df54cfe3af&extensions=base`
          );
          setWeatherData(weatherResponse.data.lives[0]);

          const forecastResponse = await axios.get(
            `https://restapi.amap.com/v3/weather/weatherInfo?city=${city}&key=f1995c0eece64ff8065cd2df54cfe3af&extensions=all`
          );
          setForecastData(forecastResponse.data.forecasts[0].casts);
        } catch (err) {
          setError('无法获取天气数据');
        }
      };
      fetchWeatherData();
    }
  }, [city]);

  // 获取 AQI 数据
  useEffect(() => {
    if (city && center) {
      const fetchAqiData = async () => {
        try {
          const latitude = center.lat;
          const longitude = center.lng;
          const response = await axios.get(
            `https://devapi.qweather.com/airquality/v1/current/${latitude}/${longitude}?key=4e9294082090488f82e6be7513f26680`
          );
          setAqiData(response.data);
        } catch (err) {
          setError('无法获取空气质量数据');
        }
      };
      fetchAqiData();
    }
  }, [city, center]);

  // 获取地方新闻数据
  useEffect(() => {
    if (city) {
      const fetchNewsData = async () => {
        try {
          const response = await axios.get('https://apis.tianapi.com/areanews/index', {
            params: {
              key: '0edd4844c643bd25502cd5d3b8531819', // 替换为你的天行API密钥
              areaname: city, // 城市名称传给 areaname
            },
          });
          setNewsData(response.data.result.list || []); // 设置新闻数据
        } catch (err) {
          setError('无法获取地方新闻数据');
        }
      };
      fetchNewsData();
    }
  }, [city]);

  return (
    <div className="app-container">
      <header className="header">
        <h1>City Map Online</h1>
        <CityInput onCityChange={handleCityChange} />
      </header>

      <div className="content">
        {/* 左侧城市简介和天气信息 */}
        <div className="left-section">
          {cityData && (
            <div className="section">
              <h2>城市简介</h2>
              <p>{cityData.title}</p>
              <p>{cityData.extract}</p>
            </div>
          )}

          {weatherData && (
            <div className="section weather-container">
              {/* 天气情况 */}
              <div className="weather-info">
                <h2>天气情况</h2>
                <p>城市: {weatherData.city}</p>
                <p>天气: {weatherData.weather}</p>
                <p>温度: {weatherData.temperature}°C</p>
                <p>湿度: {weatherData.humidity}%</p>
                <p>风向: {weatherData.winddirection}</p>
                <p>风力: {weatherData.windpower}级</p>
              </div>

              {/* 天气预报 */}
              <div className="weather-forecast">
                <h2>天气预报</h2>
                {forecastData ? (
                  forecastData.map((forecast, index) => (
                    <div key={index}>
                      <p className="forecast-date">
                        {forecast.date}
                      </p>
                      <p>
                        天气: {forecast.dayweather} ~ {forecast.nightweather}
                      </p>
                      <p>
                        温度: {forecast.nighttemp}°C ~ {forecast.daytemp}°C
                      </p>
                    </div>
                  ))
                ) : (
                  <p>暂无天气预报信息</p>
                )}
              </div>
            </div>
          )}

          {/* AQI 模块 */}
          {aqiData && aqiData.indexes && (
            <div className="section">
              <h2>空气质量信息</h2>
              <p>AQI (US 标准): {aqiData.indexes[0]?.aqiDisplay}</p>
              <p>首要污染物: {aqiData.indexes[0]?.primaryPollutant?.name || '暂无数据'}</p>
              <p>健康建议: {aqiData.indexes[0]?.health?.advice?.generalPopulation || '暂无建议'}</p>
            </div>
          )}
        </div>

        {/* 右侧静态地图 */}
        <div className="right-section">
          <StaticMap center={center} />
        </div>

        {/* 地方新闻部分，放在静态地图下方 */}
        {newsData.length > 0 && (
          <div className="news-section section">
            <h2>地方新闻</h2>
            <ul>
              {newsData.map((newsItem, index) => (
                <li key={index}>
                  <a href={newsItem.url} target="_blank" rel="noopener noreferrer">
                    <h3>{newsItem.title}</h3>
                    <p>{newsItem.description}</p>
                    <img src={newsItem.picUrl} alt={newsItem.title} width="100" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
