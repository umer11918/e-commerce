import { useNavigate ,useParams} from "react-router-dom";
import "../App.css";
import { useEffect, useState} from "react";

const Product = () => {

      const [name, setName] = useState("");
      const [price, setPrice] = useState("");
      const [category, setCategory] = useState("");
      const [company, setCompany] = useState("");
      const [images, setImages] = useState([]);
      const [error, setError] = useState(false);
      const navigate = useNavigate();
      const params = useParams();
      const { id } = useParams(); // Destructure id from useParams
    
      
      useEffect(()=>{
        productDetails();
      },[id])

      const productDetails = async () => {
        console.log(params);
        
        let result = await fetch(`http://localhost:5000/product/${id}`, {
          headers: {
            authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`
          }
      });

      
    result = await result.json();

    setName(result.name);
    setPrice(result.price);
    setCategory(result.category);
    setCompany(result.company);
    console.log(result);
    setImages(result.images || []);
};
  return (
    <div className="App">
    <div className="profile-container">
      <h1 className="profile-title">Your Profile</h1>
      <div className="profile-content">
        <div className="profile-info">
          <div className="info-item">
            <h3 className="info-label">Name:</h3>
            <p className="info-value">{name}</p>
          </div>
          <div className="info-item">
            <h3 className="info-label">Price:</h3>
            <p className="info-value">{price}</p>
          </div>
          <div className="info-item">
            <h3 className="info-label">Category:</h3>
            <p className="info-value">{category}</p>
          </div>
          <div className="info-item">
            <h3 className="info-label">Company:</h3>
            <p className="info-value">{company}</p>
          </div>
          <div className="info-item">
            <h3 className="info-label">Image:</h3>
            <div className="image-gallery">
                {images.length > 0 ? (
                  images.map((image, index) => (
                    <img
                      key={index}
                      src={`http://localhost:5000/uploads/products/${image}`}
                      alt={`Product Image ${index + 1}`}
                      style={{ width: "100px", height: "100px" }} // Adjust size and margin as needed
                    />
                  ))
                ) : (
                  <p>No images available</p>
                )}
              </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Product;
