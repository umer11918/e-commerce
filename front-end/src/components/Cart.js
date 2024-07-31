import React, { useEffect, useState } from "react";
import "./Cart.css";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const result = await fetch("http://localhost:5000/cart", {
          headers: {
            authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token")
            )}`,
          },
        });

        if (!result.ok) {
          throw new Error("Network response was not ok: " + result.statusText);
        }

        const data = await result.json();
        setCart(data.items);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchCart();
  }, []);

  const handleNavigation = () => {
    navigate("/checkout");
  };

  return (
    <div className="cart">
      <h2>Cart</h2>
      {cart.length > 0 ? (
        <>
          {cart.map((item) => (
            <div key={item.productId._id} className="cart-item">
              <ul className="cart-item-header">
                <li>
                  <h4>Image</h4>
                </li>
                <li>
                  <h4>Name</h4>
                </li>
                <li>
                  <h4>Price</h4>
                </li>
                <li>
                  <h4>Quantity</h4>
                </li>
                <li>
                  <h4>Total</h4>
                </li>
              </ul>
              <ul className="cart-item-details">
                <li>
                  <img
                    alt={`Product ${item.productId.name}`}
                    src={`http://localhost:5000/uploads/products/${item.productId.images[0]}`}
                    style={{
                      width: "70px",
                      height: "70px",
                      borderRadius: "5px",
                    }}
                  />
                </li>
                <li>
                  <p>{item.productId.name}</p>
                </li>
                <li>
                  <p>${item.productId.price}</p>
                </li>
                <li>
                  <p>{item.quantity}</p>
                </li>
                <li>
                  <p>${item.productId.price * item.quantity}</p>
                </li>
              </ul>
            </div>
          ))}
          <div className="checkout">
            <button className="checkout-button" onClick={handleNavigation}>
              Checkout
            </button>
          </div>
        </>
      ) : (
        <h4 style={{ color: "red" }}>No items in the cart</h4>
      )}
    </div>
  );
};

export default Cart;
