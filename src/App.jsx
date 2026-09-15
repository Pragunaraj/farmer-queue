import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import SlotBooking from "./SlotBooking";
import Queue from "./Queue";

function Home() {
  return (
    <div className="app">
      <nav className="navbar">
        <h2>FarmerConnect</h2>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/login">Farmer Login</Link>
          <Link to="/book-slot">Book Slot</Link>
          <Link to="/queue">Check Queue</Link>
        </div>
      </nav>

      <div className="hero">
        <h1>Farmer Procurement System</h1>

        <p>
          Book procurement slots and manage your queue easily.
        </p>

        <div className="buttons">
          <Link to="/login">
            <button>Farmer Login</button>
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/book-slot" element={<SlotBooking />} />
        <Route path="/queue" element={<Queue />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;