// ✅ ProductDetails.jsx (yeni)
import { useState } from "react";
import Breadcrumb from "./Breadcrumb/Breadcrumb";
import Gallery from "./Gallery/Gallery";
import PropTypes from "prop-types";
import Info from "./Info/Info";
import Tabs from "./Tabs/Tabs";
import "./ProductDetails.css";

const ProductDetails = ({ singleProduct, setSingleProduct }) => {
  const [ setUpdateFlag] = useState(0);

  const handleReviewUpdate = () => {
    setUpdateFlag((prev) => prev + 1);
  };

  return (
    <section className="single-product">
      <div className="container">
        <div className="single-product-wrapper">
          <Breadcrumb
            category={singleProduct.category}
            productName={singleProduct.name}
          />

          <div className="single-content column-layout">
            <Gallery singleProduct={singleProduct} />
            <Info singleProduct={singleProduct} hideButton={true} />
            <Tabs
              singleProduct={singleProduct}
              setSingleProduct={setSingleProduct}
              onReviewUpdate={handleReviewUpdate}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

ProductDetails.propTypes = {
  singleProduct: PropTypes.object.isRequired,
  setSingleProduct: PropTypes.func.isRequired,
};

export default ProductDetails;
