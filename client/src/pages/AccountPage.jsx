import axios from "axios";
import { useState } from "react";
import { useContext } from "react";
import { Navigate, useParams } from "react-router-dom";
import AccountNav from "../AccountNav.jsx";
import { UserContext } from "../UserContent.jsx";
import PlacesPage from "./PlacesPage.jsx";

export default function ProfilePage() {
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




  return (
    <div>
      <AccountNav />
      {subpage === 'profile' && (
        <div className="text-center max-w-lg mx-auto">
          Logged in as {user.name} ({user.email})<br />
          {/* Call a API endpoint to logout. (Endpoint will just reset the cookie) */}
          <button onClick={logout} className="primary max-w-sm mt-2">Logout</button>
        </div>
      )}
      {subpage === 'places' && (
        <PlacesPage />
      )}
    </div>
  );
}