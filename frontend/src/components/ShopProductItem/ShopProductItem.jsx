import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "./ShopProductItem.css";

const ShopProductItem = ({ product }) => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  return (
    <div className="shop-product-item">
      <div className="shop-product-image">
        <Link to={`/product/${product._id}`}>
          <img
            src={`${apiUrl}/api/products/${product._id}/image/mainImages/0`}
            alt={product.name}
            loading="lazy"
          />
        </Link>
      </div>
      <div className="shop-product-info">
        <Link to={`/product/${product._id}`} className="shop-product-title">
          {product.name}
        </Link>

        {/* fiyat ve indirim kısmı kaldırıldı */}

        <div className="shop-product-links">
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

ShopProductItem.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    // artık price zorunlu değil
  }).isRequired,
};

export default ShopProductItem;
