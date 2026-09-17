import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";

// Page Component Imports
import Register from "./Register";
import SlotBooking from "./SlotBooking";
import Queue from "./Queue";
import Status from "./Status";

// Landing & Home Component
function Home() {
  return (
    <div className="app">
      <nav className="navbar">
        <h2>FarmerConnect</h2>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/book-slot">Book Slot</Link>
          <Link to="/queue">Check Queue</Link>
          <Link to="/status">Procurement Status</Link>
        </div>
      </nav>

      <div className="hero">
        <h1>Farmer Procurement System</h1>
        <p>Book procurement slots and manage your queue status in real time.</p>

        <div className="buttons">
          <Link to="/register">
            <button>Register Produce</button>
          </Link>
          <Link to="/book-slot">
            <button>Book a Slot</button>
          </Link>
          <Link to="/queue">
            <button>Check Queue</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

// Login Component
function Login() {
  return (
    <div className="app">
      <h1>Farmer Login</h1>
      <p>Welcome! Please login to continue.</p>
      <Link to="/">
        <button>Back to Home</button>
      </Link>
    </div>
  );
}

// Main App Router
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/book-slot" element={<SlotBooking />} />
        <Route path="/queue" element={<Queue />} />
        <Route path="/status" element={<Status />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;