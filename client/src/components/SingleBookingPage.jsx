import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddressLink from "./AddressLink";
import BookingDates from "./BookingDates";
import PlaceGallery from "./PlaceGallery";

export default function SingleBookingPage() {
  const { id } = useParams();
  const [booking, setBookings] = useState(null);
  useEffect(() => {
    if (id) {
      axios.get('/bookings').then(response => {
        const foundBooking = response.data.find(({ _id }) => _id === id);
        if (foundBooking) {
          setBookings(foundBooking);
        }
      });
    }
  }, [id])

  if (!booking) {
    return '';
  }

  return (
    <div className="my-8">
      <h1 className="text-2xl">{booking.place.title}</h1>
      <AddressLink className="my-2">{booking.place.address}</AddressLink>
      <div className="bg-gray-200 p-6 my-6 rounded-2xl flex items-center justify-between">
        {/* Left */}
        <div>
          <h2 className="text-2xl mb-4">Your booking information:</h2>
          <BookingDates booking={booking} />
        </div>
        {/* Right */}
        <div className="bg-primary p-6 text-white rounded-2xl">
          <div>Total price: </div>
          <div className="text-3xl">${booking.price}</div>
        </div>
      </div>

      <PlaceGallery place={booking.place} />
    </div>
  );
}