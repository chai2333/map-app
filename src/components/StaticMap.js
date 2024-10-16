import React from 'react';

const StaticMap = ({ center }) => {
  const mapUrl = `https://restapi.amap.com/v3/staticmap?location=${center.lng},${center.lat}&zoom=10&size=400*300&key=f1995c0eece64ff8065cd2df54cfe3af`;

  return (
    <div id="mapContainer">
      <img src={mapUrl} alt="Static Map" />
    </div>
  );
};

export default StaticMap;
