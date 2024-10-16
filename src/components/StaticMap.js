import React from 'react';

// 引用 API 密钥
const amapKey = process.env.REACT_APP_AMAP_API_KEY;

const StaticMap = ({ center }) => {
  const mapUrl = `https://restapi.amap.com/v3/staticmap?location=${center.lng},${center.lat}&zoom=10&size=400*300&key=${amapKey}`;

  return (
    <div id="mapContainer">
      <img src={mapUrl} alt="Static Map" />
    </div>
  );
};

export default StaticMap;
