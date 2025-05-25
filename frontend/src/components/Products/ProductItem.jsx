import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "./ProductItem.css";

const ProductItem = ({ productItem }) => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  return (
    <div className="product-item">
      <div className="product-image">
        <Link to={`/product/${productItem._id}`}>
          <img
            src={`${apiUrl}/api/products/${productItem._id}/image/mainImages/0`}
            alt={productItem.name}
            loading="lazy"
          />
        </Link>
      </div>

      <div className="product-item-info">
        <Link to={`/product/${productItem._id}`} className="product-title">
          {productItem.name}
        </Link>

        <div className="product-links">
          <button>
            <i className="bi bi-heart-fill"></i>
          </button>
          <a href="#">
            <i className="bi bi-share-fill"></i>
          </a>
        </div>
      </div>
    </div>
  );
};

ProductItem.propTypes = {
  productItem: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.shape({
      current: PropTypes.number.isRequired,
      discount: PropTypes.number,
    }).isRequired,
  }).isRequired,
};

export default ProductItem;
