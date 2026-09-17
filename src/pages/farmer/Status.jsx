import { Link } from 'react-router-dom';

export default function Status() {
  return (
    <div className="app">
      <h1>Procurement Status</h1>
      <p>View weighing records, transparent pricing, and payment updates.</p>
      
      <div style={{ marginTop: '20px' }}>
        <Link to="/">
          <button>Back to Home</button>
        </Link>
      </div>
    </div>
  );
}