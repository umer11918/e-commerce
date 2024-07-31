import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ImageModal from "./Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FaShoppingCart } from "react-icons/fa";
import "./Cart-Icon.css";

const ProductList = ({ cart, setCart }) => {
  const [products, setProducts] = useState([]);
  const [expandedProductId, setExpandedProductId] = useState(null);
  const [modalImages, setModalImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    let result = await fetch("http://localhost:5000/products", {
      headers: {
        authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
    });
    result = await result.json();
    setProducts(result);
  };

  const handleViewMore = (productId) => {
    setExpandedProductId(productId);
  };

  const handleImageClick = (images, index) => {
    setModalImages(
      images.map((img) => `http://localhost:5000/uploads/products/${img}`)
    );
    setCurrentImageIndex(index);
    setShowModal(true);
  };

  const handleModalNavigate = (index) => {
    setCurrentImageIndex(index);
  };

  const handleQuantityChange = (productId, quantity) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: quantity,
    }));
  };

  const addToCart = async (product) => {
    if (!cart) {
      console.error("Cart is undefined");
      return;
    }
    
    const quantity = quantities[product._id] || 1;
    const cartItem = cart.find((item) => item.product._id === product._id);
    
    if (cartItem) {
      alert("product has been added to cart");
      setCart(
        cart.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setCart([...cart, { product, quantity }]);
    }

    const response = await fetch("http://localhost:5000/add-to-cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
      body: JSON.stringify({ productId: product._id, quantity }),
    });

    const result = await response.json();
    // Handle the result if needed
  };

  return (
    <div className="product-list">
      <h2>Products</h2>

      <div className="main">
        {products.length > 0 ? (
          products.map((product, index) => (
            <div key={product._id} className="product-item">
              <div className="product-images">
                {product.images && product.images.length > 0 ? (
                  <>
                    <img
                      alt={`Product ${index + 1} Image 1`}
                      src={`http://localhost:5000/uploads/products/${product.images[0]}`}
                      style={{ width: "300px", height: "300px", margin: "5px" }}
                      onClick={() => handleImageClick(product.images, 0)}
                    />
                    <div className="hover-overlay">
                      <FontAwesomeIcon
                        icon={faEye}
                        onClick={() => handleImageClick(product.images, 0)}
                      />
                    </div>
                    {product.images.length > 0 && (
                      <>
                        {expandedProductId === product._id ||
                        expandedProductId === 0 ? (
                          product.images.slice(1).map((image, imgIndex) => (
                            <img
                              key={imgIndex}
                              alt={`Product ${index + 1} Image ${imgIndex + 2}`}
                              src={`http://localhost:5000/uploads/products/${image}`}
                              style={{
                                width: "100px",
                                height: "100px",
                                margin: "5px",
                              }}
                              onClick={() =>
                                handleImageClick(product.images, imgIndex + 1)
                              }
                            />
                          ))
                        ) : (
                          <div className="abc">
                            <div
                              style={{
                                display: "flex",
                                fontFamily: "serif",
                                fontSize: "20px",
                                justifyContent: "space-evenly",
                                fontWeight: "800",
                              }}
                            >
                              <p className="name" style={{ color: "#000" }}>
                                {product.name}
                              </p>
                              <div style={{marginLeft: "40px"}}>
                                <p className="price" style={{ color: "#000" }}>
                                  Price :{" "}
                                  <span style={{ color: "red" }}>
                                    {" "}
                                    $ {product.price}
                                  </span>
                                </p>
                              </div>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-evenly",
                                alignItems: "center",
                              }}
                            >
                              <input
                                className="input"
                                type="number"
                                min="1"
                                value={quantities[product._id] || 1}
                                onChange={(e) =>
                                  handleQuantityChange(
                                    product._id,
                                    parseInt(e.target.value, 10)
                                  )
                                }
                              />
                              <button className="button-add-to-cart" onClick={() => addToCart(product)}>
                                Add to Cart
                              </button>
                              <Link to="/cart">
                                <div className="cart-icon">
                                  <FaShoppingCart
                                    onClick={() =>
                                      handleImageClick(product.images, 0)
                                    }
                                    style={{ fontSize: 24 }}
                                  />
                                </div>
                              </Link>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </>
                ) : (
                  <p>No images available</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <h4 style={{ color: "red" }}>No products found</h4>
        )}

        {showModal && (
          <ImageModal
            images={modalImages}
            currentIndex={currentImageIndex}
            onClose={() => setShowModal(false)}
            onNavigate={handleModalNavigate}
          />
        )}
      </div>
    </div>
  );
};

export default ProductList;
