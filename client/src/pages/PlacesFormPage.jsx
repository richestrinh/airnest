import { useState } from "react";
import Perks from "../components/Perks";
import PhotosUploader from "../components/PhotosUploader";
import axios from "axios";
import AccountNav from "../components/AccountNav";
import { json, Navigate, useParams } from "react-router-dom";
import { useEffect } from "react";

export default function PlacesFormPage() {
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [description, setDescription] = useState('');
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [maxGuests, setMaxGuests] = useState(1);
  const [price, setPrice] = useState(100);
  const [redirect, setRedirect] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);

  const { id } = useParams();
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get('/places/' + id).then(response => {
      const { data } = response;
      setTitle(data.title);
      setAddress(data.address);
      setAddedPhotos(data.photos);
      setDescription(data.description);
      setPerks(data.perks);
      setExtraInfo(data.extraInfo);
      setCheckIn(data.checkIn);
      setCheckOut(data.checkOut);
      setMaxGuests(data.maxGuests);
      setPrice(data.price);
    });
  }, [id]);

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

  async function savePlace(ev) {
    ev.preventDefault();
    const placeData = {
      title, address, addedPhotos,
      description, perks, extraInfo,
      checkIn, checkOut, maxGuests, price
    };
    // Edit an existing place in the database.
    if (id) {
      await axios.put('/places', {
        id, ...placeData
      });
      setRedirect(true);
    } else {
      // If no id, add a new place.
      await axios.post('/places', placeData);
      setRedirect(true);
    }
    // TODO: setRedirect here instead.
  }

  async function deletePlace() {
    console.log(id)
    if (id) {
      const response = await axios.delete('/places/'+id);
      if (response.data == 'success') {
        res.json('Place deleted!');
      }
      else {
        res.json('Failed to delete!');
      }
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to="/account/places" />;
  }

  return (
    <div>
      <AccountNav />
      <button className="primary" onClick={() => setDeletePopup(true)}>Delete Place</button>

      {deletePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 border">
          <div className="bg-white rounded-lg shadow-lg w-full md:w-9/12 lg:w-5/12">
            <div className="flex p-2">
              <button onClick={() => setDeletePopup(false)} className="bg-transparent text-black p-1 rounded-3xl hover:bg-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mb-6 px-6">
              <div className="flex justify-between mt-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <h3 className="text-xl lg:text-2xl font-bold mb-6 lg:mb-8">Are you sure you want to delete this place?</h3>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <div className="flex gap-6">
                <button className="primary hover:bg-darkPrimary" onClick={deletePlace}>Yes</button>
                <button className="primary hover:bg-darkPrimary" onClick={() => setDeletePopup(false)}>No</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={savePlace}>
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

        {preInput('Photos', 'photos to showcase your place')}
        <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />


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
        <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
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

          <div>
            <h3 className="mt-2 -mb-1">Price per night</h3>
            <input type="number"
              value={price}
              onChange={ev => setPrice(ev.target.value)} />
          </div>
        </div>
        <button className="primary my-4">Save</button>
      </form>
    </div>
  );
}