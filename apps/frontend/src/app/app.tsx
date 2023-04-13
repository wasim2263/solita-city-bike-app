// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';


import {Route, Routes, useNavigate} from 'react-router-dom';
import {JourneyList} from "./journey/journey-list";
import {StationList} from "./station/station-list";
import {Header} from "./header/header";
import {StationDetails} from "./station/station-details";
import NewStationForm from "./station/new-station-form";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function App() {
  const notify = (type: string, message: string) => {
    if (type === 'error') {
      toast.error(message, {position: toast.POSITION.TOP_RIGHT});
    }
    if (type === 'success') {
      toast.success(message, {position: toast.POSITION.TOP_RIGHT});
    }
    if (type === 'info') {
      toast.info(message, {position: toast.POSITION.TOP_RIGHT});
    }
  }
  const navigate = useNavigate();

  const handleNavigation = (page: string) => {
    navigate(page);
  }
  return (
    <div className="App">
      <Header handleNavigation={handleNavigation}/>
      <ToastContainer/>
      <Routes>
        <Route
          path="/journeys"
          element={<JourneyList/>}
        />
        <Route
          path="/stations"
          element={<StationList/>}
        />
        <Route path="/stations/:id" element={<StationDetails />}/>
        <Route path="/stations/new" element={<NewStationForm notify={notify}/>}/>

      </Routes>
    </div>
  );
}

export default App;
