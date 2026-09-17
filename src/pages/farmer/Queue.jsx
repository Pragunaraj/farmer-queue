import { Link } from "react-router-dom";

function Queue() {
  return (
    <div className="app">
      <h1>Queue Status</h1>

      <h2>Your Token Number: 24</h2>

      <p>Current Token: 18</p>
      <p>People Ahead: 6</p>
      <p>Estimated Waiting Time: 30 minutes</p>

      <Link to="/">
        <button>Back to Home</button>
      </Link>
    </div>
  );
}

export default Queue;