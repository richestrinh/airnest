import { createContext, useEffect, useState } from "react";
import axios from "axios";
export const UserContext = createContext({});

// Used to share the user state between components in the app.
export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    if(!user) {
      // Will get fired twice on local server.
      axios.get("/profile").then(({data}) => {
        setUser(data)
      });
      
    }
  }, []);
  return (
    <UserContext.Provider value={{user, setUser}}>
      {children}
    </UserContext.Provider>
  );
}