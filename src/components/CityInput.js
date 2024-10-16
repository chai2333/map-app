import React, { useState } from 'react';

const CityInput = ({ onCityChange }) => {
  const [city, setCity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onCityChange(city);
  };

  return (
    <form onSubmit={handleSubmit} className="city-input-form">
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="请输入城市名称"
        className="city-input"
      />
      <button type="submit" className="submit-btn">查询</button>
    </form>
  );
};

export default CityInput;
