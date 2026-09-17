import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    crop: '',
    quantity: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Farmer Registered:", formData);
    // Navigate directly to slot booking after registration
    navigate('/book-slot');
  };

  return (
    <div className="app">
      <h1>Produce Registration</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px', margin: 'auto' }}>
        <input 
          type="text" 
          placeholder="Farmer Name" 
          value={formData.name} 
          onChange={(e) => setFormData({...formData, name: e.target.value})} 
          required 
        />
        <input 
          type="tel" 
          placeholder="Phone Number" 
          value={formData.phone} 
          onChange={(e) => setFormData({...formData, phone: e.target.value})} 
          required 
        />
        <input 
          type="text" 
          placeholder="Crop Type (e.g. Wheat, Rice)" 
          value={formData.crop} 
          onChange={(e) => setFormData({...formData, crop: e.target.value})} 
          required 
        />
        <input 
          type="number" 
          placeholder="Estimated Quantity (in Quintals)" 
          value={formData.quantity} 
          onChange={(e) => setFormData({...formData, quantity: e.target.value})} 
          required 
        />
        <button type="submit">Save & Book Slot</button>
      </form>
    </div>
  );
}