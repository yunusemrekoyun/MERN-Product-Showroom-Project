import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "./ProductItem.css";

const ProductItem = ({ productItem }) => {
  return (
    <div className="product-item">
      <div className="product-image">
        <Link to={`/product/${productItem._id}`}>
          <img
            src={`${import.meta.env.VITE_API_BASE_URL}/api/products/${
              productItem._id
            }/image/0`}
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
          {/* <Link to={`/product/${productItem._id}`} className="product-link">
            <i className="bi bi-eye-fill"></i>
          </Link> */}
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
