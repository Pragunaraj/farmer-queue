import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    farmerId: "",
    procurementId: "",
    crop: "",
    quantity: "",
    pricePerKg: "",
    centreId: "",
  });

  const [result, setResult] = useState(null);
  const [searchId, setSearchId] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const recordProcurement = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/procurement",
        {
          ...formData,
          quantity: Number(formData.quantity),
          pricePerKg: Number(formData.pricePerKg),
        }
      );

      setResult(response.data);
    } catch (error) {
      setResult({
        error:
          error.response?.data?.detail ||
          "Failed to record procurement",
      });
    }
  };

  const getProcurement = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/procurement/${searchId}`
      );

      setResult(response.data);
    } catch (error) {
      setResult({
        error:
          error.response?.data?.detail ||
          "Procurement not found",
      });
    }
  };

  return (
    <div className="container">
      <h1>Farmer Procurement Test</h1>

      <div className="card">
        <h2>Record Procurement</h2>

        <input
          name="farmerId"
          placeholder="Farmer ID"
          value={formData.farmerId}
          onChange={handleChange}
        />

        <input
          name="procurementId"
          placeholder="Procurement ID"
          value={formData.procurementId}
          onChange={handleChange}
        />

        <input
          name="crop"
          placeholder="Crop"
          value={formData.crop}
          onChange={handleChange}
        />

        <input
          name="quantity"
          type="number"
          placeholder="Quantity (kg)"
          value={formData.quantity}
          onChange={handleChange}
        />

        <input
          name="pricePerKg"
          type="number"
          placeholder="Price per kg"
          value={formData.pricePerKg}
          onChange={handleChange}
        />

        <input
          name="centreId"
          placeholder="Centre ID"
          value={formData.centreId}
          onChange={handleChange}
        />

        <button onClick={recordProcurement}>
          Record Procurement
        </button>
      </div>

      <div className="card">
        <h2>Get Procurement</h2>

        <input
          placeholder="Enter Procurement ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />

        <button onClick={getProcurement}>
          Get Procurement
        </button>
      </div>

      {result && (
        <div className="card">
          <h2>Result</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;