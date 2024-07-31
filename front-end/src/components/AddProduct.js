import React, { useState } from "react";
import "../App.css";

import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [company, setCompany] = useState("");
  const [error, setError] = useState(false);
  const [images, setImages] = useState([])
  const navigate = useNavigate();
  
  const handleImageUpload = (e) => {
    setImages([...e.target.files]); // Use spread operator to handle multiple files
    console.log(e.target.files);
    console.log({"dsnjndskjnjds":e.target.files})
  };

  const addProduct = async () => {
    if (!name || !price) {
      setError(true);
      return false;
    }
  
    try {
      const userId = JSON.parse(localStorage.getItem("user"))._id;
      console.log("User ID:", userId);
  
      // Create FormData object
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("company", company);
      formData.append("userId", userId);
  
      // Append each image file
      images.forEach((file) => {
        formData.append('images', file); // Append without index for array handling
      });
  
      let response = await fetch("http://localhost:5000/add-product", {
        method: "POST",
        body: formData,
        headers: {
          "Authorization": `bearer ${JSON.parse(localStorage.getItem("token"))}`
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      let result = await response.json();
      console.log("Response:", result);
  
      navigate("/");
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };
  

  return (
    <div className="product-list">
      <h1>AddProduct</h1>
      <div className="main-content">
        <div className="form">
          <div className="input-container">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter product name"
            />
            {error && !name && <span className="error">Enter valid name</span>}
          </div>

          <div className="input-container">
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter product price"
            />
            {error && !price && (
              <span className="error">Enter valid price</span>
            )}
          </div>

          <div className="input-container">
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Enter product category"
            />
            {error && !category && (
              <span className="error">Enter valid name</span>
            )}
          </div>
          <div className="input-container">
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Enter company"
            />
            {error && !company && (
              <span className="error">Enter valid name</span>
            )}
          </div>
          <input
          type="file"
          multiple
          onChange={(e) => handleImageUpload(e)}
        />
          <div>
            <button onClick={addProduct} className="button">
              AddProduct
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
