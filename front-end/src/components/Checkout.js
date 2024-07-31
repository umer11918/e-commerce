import React, { useEffect, useState } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem("user");
    if (!auth) {
      navigate("/login"); // Redirect to login if not authenticated
    }
  }, [navigate]);

  const order = () => {
    console.log("Order function called"); // Debugging line
    try {
      alert("Order has been placed");
      
      navigate("/productlist");
    } catch (error) {
      console.error("Error displaying alert:", error);
    }
  };

  return (
    <div className="product-list">
      <h1>Checkout Details</h1>
      <div className="form">
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Email"
          />
          <input
            type="text"
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter Phone Number"
          />
          <input
            type="text"
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter Address"
          />
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
          />
        <div>
          <button onClick={order} className="button">Order</button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
