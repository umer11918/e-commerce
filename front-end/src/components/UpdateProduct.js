import React, { useEffect, useState } from "react";
import "../App.css";
import { useParams , useNavigate} from "react-router-dom";

const UpdateProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [company, setCompany] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  
  useEffect(()=>{
    productDetails();
  },[])

  const productDetails = async () => {
    console.log(params);
    
    let result = await fetch(`http://localhost:5000/product/${params.id}`, {
      headers: {
        authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`
      }
  });
    result = await result.json();

    setName(result.name);
    setPrice(result.price);
    setCategory(result.category);
    setCompany(result.company);
};

  const updateProduct = async () => {

    console.log(name,price);
    if (!name || !price) {
      setError(true);
      return false;
    }
    // const userId = JSON.parse(localStorage.getItem("user"))._id;
    // console.log(userId);
    let result = await fetch(`http://localhost:5000/product/${params.id}`, {
      method: "PUT",
      body: JSON.stringify({ name, price, category, company}),
      headers: {
        "Content-Type": "application/json",
        authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`
      
      },
    });

    result = await result.json();
    console.log(result);
    navigate('/')
  };

  return (
    <div className="product-list">
      <h1>UpdateProduct</h1>
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
            {error && !category && <span className="error">Enter valid name</span>}
          </div>
          <div className="input-container">
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Enter company"
            />
            {error && !company && <span className="error">Enter valid name</span>}
          </div>

          <div>
            <button onClick={updateProduct} className="button">
            updateProduct
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProduct;
