import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Perks from "../Perks";

export default function PlacesPage() {
  // Grab action from URL
  const { action } = useParams();
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [addedPhoto, setAddedPhoto] = useState([]);
  const [photoLink, setPhotoLink] = useState('');
  const [description, setDescription] = useState('');
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [maxGuests, setMaxGuests] = useState(1);
  function inputHeader(text) {
    return (
      <h2 className="text-2xl mt-4">{text}</h2>
    );
  };
  function inputDescription(text) {
    return (
      <p className="text-gray-500 text-sm">{text}</p>
    );
  };
  function preInput(header, description) {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  }
  return (
    <div>
      {/* Show add new place button if we haven't clicked it yet */}
      {action !== 'new' && (
        <div className="text-center">
          <Link className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full" to={'/account/places/new'}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add new place
          </Link>
        </div>
      )}

      {/* Show form if we clicked add new place button */}
      {action === 'new' && (
        <div>
          <form>
            {preInput('Title', 'title for your place.')}
            <input type="text"
              value={title}
              onChange={ev => setTitle(ev.target.value)}
              placeholder="title, for example: My lovely apt" />

            {preInput('Address', 'address for your place.')}
            <input type="text"
              value={address}
              onChange={ev => setAddress(ev.target.value)}
              placeholder="address" />

            {/* Add by Link */}
            {preInput('Photos', 'photos to showcase your place')}
            <div className="flex gap-2">
              <input type="text"
                value={photoLink}
                onChange={ev => setPhotoLink(ev.target.value)}
                placeholder="Add photo using a link (.jpg format)" />
              <button className="bg-gray-200 px-4 rounded-2xl">Add&nbsp;photo</button>
            </div>

            {/* Upload Button */}
            <div className="mt-2 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              <button className="flex gap-1 justify-center border bg-transparent rounded-2xl p-8 text-2xl text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                </svg>
                Upload
              </button>
            </div>

            {preInput('Description', 'description for your place.')}
            <textarea value={description} onChange={ev => setDescription(ev.target.value)} />

            {preInput('Perks', 'Select all the perks for your place.')}
            <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
              <Perks selected={perks} onChange={setPerks} />
            </div>

            {preInput('Extra Info', 'house rules, etc')}
            <textarea
              value={extraInfo}
              onChange={ev => setExtraInfo(ev.target.value)} />

            {preInput('Check in&out times', 'add check in and out times, remember to have a time window for cleaning room between guests')}
            <div className="grid gap-2 sm:grid-cols-3">
              <div>
                <h3 className="mt-2 -mb-1">Check in time</h3>
                <input type="text"
                  value={checkIn}
                  onChange={ev => setCheckIn(ev.target.value)}
                  placeholder="14:00" />
              </div>

              <div>
                <h3 className="mt-2 -mb-1">Check out time</h3>
                <input type="text"
                  value={checkOut}
                  onChange={ev => setCheckOut(ev.target.value)}
                  placeholder="11:00" />
              </div>

              <div>
                <h3 className="mt-2 -mb-1">Max number of guests</h3>
                <input type="number"
                  value={maxGuests}
                  onChange={ev => setMaxGuests(ev.target.value)} />
              </div>
            </div>
            <button className="primary my-4">Save</button>
          </form>
        </div>
      )}

    </div>
  )
}
