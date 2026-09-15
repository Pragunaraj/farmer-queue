function SlotBooking() {
  return (
    <div className="app">
      <h1>Book a Procurement Slot</h1>

      <div>
        <label>Farmer Name</label>
        <br />
        <input type="text" placeholder="Enter your name" />
      </div>

      <br />

      <div>
        <label>Phone Number</label>
        <br />
        <input type="text" placeholder="Enter phone number" />
      </div>

      <br />

      <div>
        <label>Crop</label>
        <br />
        <select>
          <option>Select Crop</option>
          <option>Rice</option>
          <option>Wheat</option>
          <option>Maize</option>
          <option>Ragi</option>
        </select>
      </div>

      <br />

      <div>
        <label>Preferred Date</label>
        <br />
        <input type="date" />
      </div>

      <br />

      <div>
        <label>Preferred Time</label>
        <br />
        <select>
          <option>Select Time</option>
          <option>9:00 AM - 10:00 AM</option>
          <option>10:00 AM - 11:00 AM</option>
          <option>11:00 AM - 12:00 PM</option>
          <option>2:00 PM - 3:00 PM</option>
        </select>
      </div>

      <br />

      <button>Book Slot</button>

      <br />
      <br />

      <a href="/">Back to Home</a>
    </div>
  );
}

export default SlotBooking;