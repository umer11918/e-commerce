import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [image, setImage] = useState(null);

  const [imagePath, setImagePath] = useState(""); // State to store the image path


  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImage(file);
    console.log(file);
  };
  const navigate = useNavigate();
  useEffect(() => {
    const auth = localStorage.getItem("user");
    if (auth) {
      navigate("/login");
    }
  }, [navigate]);


  const collectData = async () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    if (image) {
      formData.append('image', image); // Append the image file object
    }
  
    try {
      let response = await fetch("http://localhost:5000/register", {
        method: "POST",
        body: formData, // Use FormData as the body
      });
      if (!response.ok) {
        const errorResult = await response.json();
        if (errorResult.result === "Name or email already exists") {
          alert("Name or email already exists.");
        } else {
          alert("An error occurred. Please try again.");
        }
        return; // Exit early to prevent further processing
      }
    
      let result = await response.json();
      console.log({"ssaas": result});
      if (result) {
        localStorage.setItem("user", JSON.stringify(result.result));
        localStorage.setItem("token", JSON.stringify(result.auth));
        navigate("/login");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <div className="product-list">
      <h1>Register</h1>
      <div className="form">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e)}
        />

        <div>
          <button onClick={collectData} className="button">
            Sign Up
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default SignUp;
