import PropTypes from "prop-types";
import "./HeroImage.css";

const HeroImage = ({ product }) => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const imageUrl = `${apiUrl}/api/products/${product._id}/image/mainImages/0`;

  const scrollToDetails = () => {
    const target = document.getElementById("description-blocks");
    if (target) target.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="hero-section">
      <div className="hero-image" style={{ "--bg-url": `url(${imageUrl})` }}>
        <img src={imageUrl} alt={product.name} className="hero-img" />

        <div className="product-name-tag">
          <h2>{product.name}</h2>
        </div>

        <div className="hero-button-wrapper">
          <button className="scroll-btn" onClick={scrollToDetails}>
            Detayları Gör ↓
          </button>
        </div>
      </div>
    </section>
  );
};

HeroImage.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string,
  }).isRequired,
};

export default HeroImage;
