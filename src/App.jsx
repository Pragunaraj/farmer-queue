import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import "./App.css";
import SlotBooking from "./SlotBooking";
import Queue from "./Queue";
import Dashboard from "./pages/admin/Dashboard";
import ScanToken from "./pages/admin/ScanToken";
import QualityEntry from "./pages/admin/QualityEntry";
import Inventory from "./pages/admin/Inventory";

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
          <Link to="/admin/dashboard">Admin Dashboard</Link>
          <Link to="/admin/scan">Scan Token</Link>
          <Link to="/admin/quality">Quality Entry</Link>
          <Link to="/admin/inventory">Inventory</Link>
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
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/book-slot" element={<SlotBooking />} />
        <Route path="/queue" element={<Queue />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/scan" element={<ScanToken />} />
        <Route path="/admin/quality" element={<QualityEntry />} />
        <Route path="/admin/inventory" element={<Inventory />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;