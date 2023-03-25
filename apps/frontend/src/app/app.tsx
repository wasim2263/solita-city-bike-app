// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';


import { Route, Routes, useNavigate } from 'react-router-dom';
import {JourneyList} from "./journey-list/journey-list";
import StationList from "./station-list/station-list";
import {Header} from "./header/header";

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
      </Routes>
    </div>
  );
}

export default App;
