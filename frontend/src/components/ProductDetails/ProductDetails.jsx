import { useState } from "react";
import Breadcrumb from "./Breadcrumb/Breadcrumb";
import Gallery from "./Gallery/Gallery";
import PropTypes from "prop-types";
import Info from "./Info/Info";
import "./ProductDetails.css";
import Tabs from "./Tabs/Tabs";

const ProductDetails = ({ singleProduct, setSingleProduct }) => {
  const [updateFlag, setUpdateFlag] = useState(0);

  const handleReviewUpdate = () => {
    setUpdateFlag((prev) => prev + 1);
  };

  return (
    <section className="single-product">
      <div className="container">
        <div className="single-product-wrapper">
          {/* 1) Pass category & name into breadcrumb */}
          <Breadcrumb
            category={singleProduct.category}
            productName={singleProduct.name}
          />

          <div className="single-content">
            <main className="site-main">
              <Gallery singleProduct={singleProduct} />
              <Info singleProduct={singleProduct} updateFlag={updateFlag} />
            </main>
          </div>

          <Tabs
            singleProduct={singleProduct}
            setSingleProduct={setSingleProduct}
            onReviewUpdate={handleReviewUpdate}
          />
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
