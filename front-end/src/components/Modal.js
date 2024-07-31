// ImageModal.js
import React from 'react';
import '../Modal.css'; // Import your CSS file

const ImageModal = ({ images, currentIndex, onClose, onNavigate }) => {
  if (!images || images.length === 0) return null;

  const handlePrev = () => {
    onNavigate(Math.max(currentIndex - 1, 0));
  };

  const handleNext = () => {
    onNavigate(Math.min(currentIndex + 1, images.length - 1));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <img
          src={images[currentIndex]}
          alt={`Product Image ${currentIndex + 1}`}
          className="modal-image"
        />
        <button className="nav-button prev-button" onClick={handlePrev}>
          &lt;
        </button>
        <button className="nav-button next-button" onClick={handleNext}>
          &gt;
        </button>
        <button className="close-button" onClick={onClose}>
          X
        </button>
      </div>
    </div>
  );
};

export default ImageModal;
