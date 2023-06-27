import axios from "axios";
import { useState } from "react";
import { useContext } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { UserContext } from "../UserContent.jsx";

export default function AccountPage() {
  const [redirect, setRedirect] = useState(null);
  const { ready, user, setUser } = useContext(UserContext);
  let { subpage } = useParams();
  if (subpage === undefined) {
    subpage = 'profile';
  }

  async function logout() {
    await axios.post("/logout");
    // Redirect to homepage after logout.
    setRedirect('/');
    setUser(null);
  }
  
  // Redirect to homepage after logout.
  if (redirect) {
    return <Navigate to={redirect} />;
  }

  if (!ready) {
    return "Loading...";
  }

  // if user is not logged in, redirect to login page
  if (ready && !user) {
    return <Navigate to={"/login"} />;
  }

  function linkClasses(type = null) {
    let classes = 'py-2 px-6';

    if (type === subpage) {
      classes += ' bg-primary text-white rounded-full';
    }
    return classes;
  }


  return (
    <div>
      <nav className="w-full flex mt-8 gap-2 mb-8 justify-center">
        <Link className={linkClasses('profile')} to={'/account'}>My Profile</Link>
        <Link className={linkClasses('bookings')} to={'/account/bookings'}>My Bookings</Link>
        <Link className={linkClasses('places')} to={'/account/places'}>My Accommodation</Link>
      </nav>
      {subpage === 'profile' && (
        <div className="text-center max-w-lg mx-auto">
          Logged in as {user.name} ({user.email})<br />
          {/* Call a API endpoint to logout. (Endpoint will just reset the cookie) */}
          <button onClick={logout} className="primary max-w-sm mt-2">Logout</button>
        </div>
      )}
    </div>
  );
}