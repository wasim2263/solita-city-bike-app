// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';


import { Route, Routes, Link } from 'react-router-dom';
import JourneyList from "./journey-list/journey-list";
import StationList from "./station-list/station-list";

export function App() {
  return (
    <div className="App">
      <Routes>
        <Route
          path="/journeys"
          element={<JourneyList/>}
        />
        <Route
          path="/stations"
          element={<StationList/>}
        />
      </Routes>
    </div>
  );
}

export default App;
