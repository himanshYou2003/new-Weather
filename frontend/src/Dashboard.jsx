// Dashboard.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3000/dashboard')
      .then((response) => {
        setUser(response.data);
      })
      .catch(() => {
        window.location.href = '/'; // Redirect to login if not authenticated
      });
  }, []);

  return (
    <div className="dashboard">
      {user ? (
        <div>
          <h1>Welcome, {user.displayName}</h1>
          <p>Email: {user.emails[0].value}</p>
          <img src={user.photos[0].value} alt="Profile" />
          <a href="http://localhost:3000/logout">Logout</a>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default Dashboard;
