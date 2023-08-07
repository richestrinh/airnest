import './App.css'
import { Routes, Route } from "react-router-dom";
import IndexPage from './IndexPage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import ProfilePage from './AccountPage';
import Layout from '../components/Layout';
import axios from 'axios';
import { UserContextProvider } from '../components/UserContent';
import PlacesPage from './PlacesPage';
import PlacesFormPage from './PlacesFormPage';
import SinglePlacePage from './SinglePlacePage';
import BookingsPage from '../components/BookingsPage';
import SingleBookingPage from '../components/SingleBookingPage';

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
// Setting withCredentials to true will have Axios include cookies in the request it sends.
axios.defaults.withCredentials = true;

function App() {
  
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/account/" element={<ProfilePage />} />
          <Route path="/account/places" element={<PlacesPage />} />
          <Route path="/account/places/new" element={<PlacesFormPage />} />
          <Route path="/account/places/:id" element={<PlacesFormPage />} />
          <Route path="/place/:id" element={<SinglePlacePage />} />
          <Route path="/account/bookings" element={<BookingsPage />} />
          <Route path="/account/bookings/:id" element={<SingleBookingPage />} />
        </Route>
      </Routes>
    </UserContextProvider>
  )
}

export default App
