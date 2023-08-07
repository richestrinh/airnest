import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import AccountNav from "../components/AccountNav";
import PlaceImg from "../components/PlaceImg";
export default function PlacesPage() {
const [places, setPlaces] = useState([]);
const [isMobile, setIsMobile] = useState(false);
  // After rendering, get places from the database.
  useEffect(() => {
    axios.get('/user-places').then(({ data }) => {
      setPlaces(data);
    });
  }, []);
  useEffect(() => {
    const handleResize = () => {
      console.log(window.innerWidth);
      setIsMobile(window.innerWidth <= 1200);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, []);
  function truncateDescription(description) {
    if (description.length > 500 && isMobile) {
      return description.substring(0, 500) + "...";
    } else if (description.length > 1300 && !isMobile) {
      return description.substring(0, 1300) + "...";
    }
    else {
    return description;
    }
  }
  return (
    <div>
      <AccountNav />
      <div className="text-center">
        <Link className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full" to={'/account/places/new'}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add new place
        </Link>
      </div>

      {/* Displaying of places. */}
      <div className="mt-4">
        {places.length > 0 && places.map(place => (
            // For each place.
          <div key={place._id}>
          <Link to={'/account/places/'+place._id} className="flex cursor-pointer gap-4 bg-gray-100 p-4 rounded-2xl mb-4 shadow-md">
            <div className="flex w-32 h-32 bg-gray-300 grow shrink-0">            
              <PlaceImg place={place} /> 
            </div>
            <div className="grow-0 shrink">
              <h2 className="text-xl">{place.title}</h2>
              <p className="text-sm mt-2">{truncateDescription(place.description)}</p>
            </div>
          </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
