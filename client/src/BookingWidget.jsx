import { useState, useContext, useEffect} from "react";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";
import { Navigate } from "react-router-dom";
import {  } from "react";
import { UserContext } from "./UserContent";


export default function BookingWidget({ place }) {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [numOfGuests, setNumOfGuests] = useState(1);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [redirect, setRedirect] = useState('');
  const {user} = useContext(UserContext);

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  let numOfNights = 0;

  if (checkIn && checkOut) {
    numOfNights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn))
  }

  async function createBooking(ev) {
    ev.preventDefault();
    const data = {checkIn, checkOut, numOfGuests, name, mobile,
      place: place._id,
      price: numOfNights * place.price,
    };
    const response = await axios.post('/bookings', data);
    const bookingId = response.data._id;
    setRedirect(`/account/bookings/${bookingId}`);
  }
  
  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div className="bg-white shadow p-4 rounded-2xl">
      <div className="text-2xl text-center">
        Price: ${place.price} / per night
      </div>
      <div className="border rounded-2xl mt-4">
        <div className="flex">
          <div className="py-3 px-4">
            <label>Check in:</label>
            <input type="date"
              value={checkIn}
              onChange={(ev) => setCheckIn(ev.target.value)}
            />
          </div>

          <div className="py-3 px-4 border-l">
            <label>Check out:</label>
            <input type="date"
              value={checkOut}
              onChange={(ev) => setCheckOut(ev.target.value)}
            />
          </div>
        </div>

        <div className="py-3 px-4 border-t">
          <label>Number of guests:</label>
          <input type="number"
            value={numOfGuests}
            onChange={(ev) => setNumOfGuests(ev.target.value)}
          />
        </div>

        {numOfNights > 0 && (
          <div className="py-3 px-4 border-t">
            <label>Full Name:</label>
            <input type="text"
              placeholder="name"
              value={name}
              onChange={(ev) => setName(ev.target.value)}
            />

            <label>Phone number:</label>
            <input type="tel"
              placeholder="mobile"
              value={mobile}
              onChange={(ev) => setMobile(ev.target.value)}
            />
          </div>

        )}



      </div>
      <button onClick={createBooking} className="primary">
        Book
        {numOfNights > 0 && (
          <span> ${numOfNights * place.price} for {numOfNights} nights.</span>
        )}
      </button>
    </div>

  );
}