import React from 'react';

const EventCard = ({ title, time }) => {
  return (
    <div className="mb-1 p-2 bg-blue-100 text-blue-800 text-xs rounded shadow-sm">
      <div className="font-semibold">{title}</div>
      <div>{time}</div>
    </div>
  );
};

export default EventCard;
