import React, { useState } from 'react';

const NewStationForm: React.FC = () => {
  const [stationName, setStationName] = useState('');
  const [stationLocation, setStationLocation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Perform form submission logic, e.g. API call to create new station
    console.log('Form submitted:', stationName, stationLocation);
    // Reset form fields after submission
    setStationName('');
    setStationLocation('');
  };

  return (
    <div>
      <h1>Create New Station</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Station Name:
          <input
            type="text"
            value={stationName}
            onChange={(e) => setStationName(e.target.value)}
          />
        </label>
        <label>
          Station Location:
          <input
            type="text"
            value={stationLocation}
            onChange={(e) => setStationLocation(e.target.value)}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default NewStationForm;
