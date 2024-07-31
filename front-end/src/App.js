import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import "./App.css";
import SignUp from "./components/SignUp";
import PrivateRoute from "./components/PrivetComp";
import Login from "./components/Login";
import AddProduct from "./components/AddProduct";
import Products from "./components/Products";
import UpdateProduct from "./components/UpdateProduct";
import Profile from "./components/Profile";
import Product from "./components/Viewproduct";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";

function App() {
  const [cart, setCart] = useState (()=>{

  const savedCart = localStorage.getItem("cart");
  return savedCart ? JSON.parse(savedCart) : [];

});

  useEffect(() => {
    // Save cart data to local storage whenever it changes
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);


  return (
    <div className="App">
      <Router>
        <Nav />
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Products />} />
            <Route path="/productlist" element={<ProductList cart={cart} setCart={setCart} />} />
            <Route path="/cart" element={<Cart cart={cart} />} />
            <Route path="/add" element={<AddProduct />} />
            <Route path="/update/:id" element={<UpdateProduct />} />
            <Route path="/viewproduct/:id" element={<Product />} />
            <Route path="/update/" element={<Products />} />
            <Route path="/logout" element={<h1>Logout</h1>} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/checkout" element={<Checkout />} />
          </Route>
          <Route path="/signup" element={<SignUp />}></Route>
          <Route path="/login" element={<Login />}></Route>
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
