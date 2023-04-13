import React, {useState} from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import axios, {AxiosError} from "axios";
import {useNavigate} from "react-router-dom";

interface StationFormProps {
  notify: (type: string, message: string) => void;
}

export interface StationInterface {
  address: string;
  latitude: number;
  name: string;
  capacities: number;
  longitude: number;
  station_id: string;
}

const NewStationForm: React.FC<StationFormProps> = ({notify}) => {
  const [stationName, setStationName] = useState('');
  const [stationAddress, setStationAddress] = useState('');
  const [stationCapacities, setStationCapacities] = useState(0);
  const [stationLatitude, setStationLatitude] = useState(0);
  const [stationLongitude, setStationLongitude] = useState(0);
  const [stationId, setStationId] = useState("");
  const [nameError, setNameError] = useState('');
  const navigate = useNavigate();


  const handlePost = async (data: StationInterface) => {
    try {
      const response = await axios.post('/api/stations', data);
      console.log('Post request successful:', response.data);
      if (response.status == 201) {
        notify('success', 'Station added successfully');
        navigate('/stations')
      }
    } catch (error: Error | AxiosError | any) {
      let errorMessage = 'Fail to add station';
      if (error?.response) {
        errorMessage = error.response.data.message;
      }
      notify('error', errorMessage);

    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (stationName === '') {
      setNameError('Station Name is required');
      return;
    } else {
      setNameError('');
    }
    // Gather data from form fields or other sources
    const postData = {
      name: stationName,
      address: stationAddress,
      capacities: stationCapacities,
      latitude: stationLatitude,
      longitude: stationLongitude,
      station_id: stationId,
    };
    handlePost(postData);
  };


  return (
    <div className="new-station-form-container">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        width="50%"
        mx="auto"
      >
        <h1>Create New Station</h1>
      </Box>
      <form className="new-station-form" onSubmit={handleSubmit}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          width="50%"
          mx="auto"
        >
          <Box mb={2}>
            <TextField
              fullWidth
              label="Station Name *"
              value={stationName}
              error={!!nameError}
              helperText={nameError}
              onChange={(e) => setStationName(e.target.value)}
            />
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Station Address"
              value={stationAddress}
              onChange={(e) => setStationAddress(e.target.value)}
            />
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Capacities"
              type="number"
              value={stationCapacities}
              onChange={(e) => setStationCapacities(parseInt(e.target.value))}
            />
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Latitude"
              type="number"
              value={stationLatitude}
              onChange={(e) => setStationLatitude(parseFloat(e.target.value))}
            />
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Longitude"
              type="number"
              value={stationLongitude}
              onChange={(e) => setStationLongitude(parseFloat(e.target.value))}
            />
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Station ID"
              type="string"
              value={stationId}
              placeholder="auto assign if kept empty"
              onChange={(e) => setStationId(e.target.value)}
            />
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            width="50%"
            mx="auto"
          >
            <Button fullWidth variant="contained" type="submit">
              Submit
            </Button>
          </Box>
        </Box>
      </form>
    </div>
  );
};

export default NewStationForm;
