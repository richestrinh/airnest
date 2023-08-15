import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AddressLink from "../components/AddressLink";
import BookingWidget from "../components/BookingWidget";
import PlaceGallery from "../components/PlaceGallery";

export default function SinglePlacePage() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);


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

  // Every time id changes, we need to fetch the data.
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get(`/places/${id}`).then(res => {
      setPlace(res.data);
    });
  }, [id]);

  if (!place) return '';

  return (
    <div className="mt-4 bg-gray-100 -mx-8 px-8 pt-8">
      <div className="mx-8 md:mx-24 lg:mx-32 2xl:mx-64">
        <h1 className="text-2xl">{place.title}</h1>
        <AddressLink children={place.address} />

        {/* Photo Album */}
        <PlaceGallery place={place} />

        <div className="mt-8 mb-8 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]">
          <div>
            <div className="my-4">
              <h2 className="font-semibold text-2xl">Description</h2>
              {truncateDescription(place.description)}

              <div className="mt-6 cursor-pointer gap-1.5 flex w-fit h-fit font-semibold" onClick={() => setOpenPopup(true)}>
                Show More
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                </svg>
              </div>
            </div>

            {openPopup && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg shadow-lg w-full md:w-9/12 lg:w-5/12 animate-dropIn">
                  <div className="flex p-4">
                    <button onClick={() => setOpenPopup(false)} className="bg-transparent text-black p-1 rounded-3xl hover:bg-gray-300">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="overflow-y-auto h-[50vh] lg:h-[75vh] px-6">
                    <h3 className="text-2xl font-bold mb-4">About this place</h3>
                    {place.description}
                  </div>
                </div>
              </div>
            )}

            Check-in: {place.checkIn} <br />
            Check-out: {place.checkOut} <br />
            Max number of guests: {place.maxGuests} <br />
          </div>
          <div>
            <BookingWidget place={place} />
          </div>
        </div>

        <div className="bg-white -mx-8 px-8 py-8 border-t">
          <div>
            <h2 className="font-semibold text-2xl" >Extra Info</h2>
          </div>
          <div className="mb-4 mt-2 text-sm text-gray-700 leading-5">{place.extraInfo}</div>
        </div>
      </div>
    </div >
  );
}