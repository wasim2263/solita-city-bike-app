// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';


import {Route, Routes, useNavigate} from 'react-router-dom';
import {JourneyList} from "./journey/journey-list";
import {StationList} from "./station/station-list";
import {Header} from "./header/header";
import {StationDetails} from "./station/station-details";
import NewStationForm from "./station/new-station-form";

export function App() {
  const navigate = useNavigate();

  const handleNavigation = (page: string) => {
    navigate(page);
  }
  return (
    <div className="App">
      <Header handleNavigation={handleNavigation}/>
      <Routes>
        <Route
          path="/journeys"
          element={<JourneyList/>}
        />
        <Route
          path="/stations"
          element={<StationList/>}
        />
        <Route path="/stations/:id" element={<StationDetails/>}/>
        <Route path="/stations/new" element={<NewStationForm />} />

      </Routes>
    </div>
  );
}

export default App;
