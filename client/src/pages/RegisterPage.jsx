import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  async function registerUser(ev) {
    // Prevent default behavior of the form submit (which is to refresh the page)
    ev.preventDefault();
    try {
      // Send request to API. Defaults to localhost:4000 in App.jsx.
      await axios.post('/register', {
        name,
        email,
        password,
      });
      alert('Registered successfully! Now you can login.');
    } catch (err) {
      alert("Register failed. Please try again later.");
    }
  }
  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Register</h1>
        {/* On submission, call registerUser function */}
        <form className="max-w-md mx-auto" onSubmit={registerUser}>
          
          {/* On change of the fields update the state variables using the useState hook */}
          <input type="text" placeholder="John Doe"
            value={name}
            onChange={ev => setName(ev.target.value)} />
          <input type="email" placeholder="your@email.com"
            value={email}
            onChange={ev => setEmail(ev.target.value)} />
          <input type="password" placeholder="password"
            value={password}
            onChange={ev => setPassword(ev.target.value)} />

          <button className="primary">Register</button>
          <div className="text-center py-2 text-gray-500">
            Already a member? <Link className="underline text-black" to={'/login'}>Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}