import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const loggedinUser = localStorage.getItem("user");
    if (loggedinUser) {
      setUser(JSON.parse(loggedinUser));
    }
  }, []);
  if (!user) {
    return <div>Loading...</div>; // Display a loading message or spinner while the data is being fetched
  }

  return (
    <div className="App">
    <div className="profile-container">
      <h1 className="profile-title">Your Profile</h1>
      <div className="profile-content">
        <div className="profile-info">
          <div className="info-item">
            <h3 className="info-label">Name:</h3>
            <p className="info-value">{user.name}</p>
          </div>
          <div className="info-item">
            <h3 className="info-label">Email:</h3>
            <p className="info-value">{user.email}</p>
          </div>
          <div className="info-item">
            <h3 className="info-label">Profile Image:</h3>
            {user.image && (
              <img className="image-gallery"
                src={`http://localhost:5000/uploads/profiles/${user.image}`}
                alt="Profile" style={{width: "100px", height: "100px"}}
              />
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Profile;
