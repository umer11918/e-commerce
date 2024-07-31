import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDeleteLeft,
  faEdit,
  faEye,
  faSearch,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import ImageModal from "./Modal"; // Import the modal component

const Products = () => {
  const [products, setProducts] = useState([]);
  const [expandedProductId, setExpandedProductId] = useState(null); // State for expanded images
  const [modalImages, setModalImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);

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

  const deleteProduct = async (id) => {
    let result = await fetch(`http://localhost:5000/product/${id}`, {
      method: "Delete",
      headers: {
        authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
    });
    result = await result.json();
    if (result) {
      alert("product deleted");
      getProducts();
    }
  };

  const search = async (event) => {
    let key = event.target.value;
    if (key) {
      let result = await fetch(`http://localhost:5000/search/${key}`, {
        headers: {
          authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      });
      result = await result.json();
      if (result) {
        setProducts(result);
      }
    } else {
      getProducts();
    }
  };

  const handleToggleImages = (productId) => {
    setExpandedProductId(expandedProductId === productId ? null : productId);
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

  return (
    <div className="product-list">
      <div className="pro_head">
        <h1>Products List</h1>
        <div className="search-container">
          <FontAwesomeIcon className="search-icon" icon={faSearch} />
          <input
            type="text"
            className="search"
            placeholder="Search product"
            onChange={search}
          ></input>
        </div>
      </div>
        {products.length > 0 ? (
          products.map((item, index) => (
            <div className="product-ul">
              <ul>
                <li>S No</li>
                <li>Product</li>
                <li>Price</li>
                <li>Category</li>
                <li>Company</li>
                <li>Image</li>
                <li>Operations</li>
              </ul>

              <ul key={item._id}>
                <li>{index + 1}</li>
                <li>{item.name}</li>
                <li>{item.price}</li>
                <li>{item.category}</li>
                <li>{item.company}</li>
                <li>
                  {item.images && item.images.length > 0 ? (
                    <div className="list">
                      <img
                        src={`http://localhost:5000/uploads/products/${item.images[0]}`}
                        alt="Product Image"
                        style={{ width: "50px", height: "40px" }} // Adjust size as needed
                        onClick={() => handleImageClick(item.images, 0)}
                      />
                      {item.images.length > 1 && (
                        <>
                          {expandedProductId === item._id ? (
                            <>
                              {item.images.slice(1).map((image, i) => (
                                <img
                                  key={i}
                                  src={`http://localhost:5000/uploads/products/${image}`}
                                  alt={`Additional Product Image ${i + 1}`}
                                  style={{
                                    width: "80px",
                                    height: "80px",
                                    margin: "5px",
                                  }} // Adjust size as needed
                                  onClick={() =>
                                    handleImageClick(item.images, i + 1)
                                  }
                                />
                              ))}
                            </>
                          ) : (
                            <button
                              className="btn_view_more"
                              onClick={() => handleImageClick(item.images, 0)}
                            >
                              +
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  ) : (
                    <p>No images available</p>
                  )}
                </li>
                <li>
                  <button
                    className="icon_btn"
                    onClick={() => deleteProduct(item._id)}
                  >
                    <FontAwesomeIcon className="delete-icon" icon={faTrash} />
                  </button>
                  <Link to={`/update/${item._id}`}>
                    <button className="icon_btn">
                      <FontAwesomeIcon className="delete-icon" icon={faEdit} />
                    </button>
                  </Link>
                  <Link to={`/viewproduct/${item._id}`}>
                    <button className="icon_btn">
                      <FontAwesomeIcon className="delete-icon" icon={faEye} />
                    </button>
                  </Link>
                </li>
              </ul>
            </div>
          ))
        ) : (
          <h4 style={{ color: "red" }}>No result found</h4>
        )}
      
      
      {/* Render the modal */}
      {showModal && (
        <ImageModal
          images={modalImages}
          currentIndex={currentImageIndex}
          onClose={() => setShowModal(false)}
          onNavigate={handleModalNavigate}
        />
      )}
    </div>
  );
};

export default Products;
