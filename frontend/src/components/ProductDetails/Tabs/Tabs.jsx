
import { useState } from "react";
import PropTypes from "prop-types";
import Reviews from "../../Reviews/Reviews";
import "./Tabs.css";

const Tabs = ({ singleProduct, setSingleProduct, onReviewUpdate }) => {
  const [activeTab, setActiveTab] = useState("desc");

  return (
    <div className="single-tabs">
      <ul className="tab-list">
        <li>
          <a
            href="#"
            className={`tab-button ${activeTab === "buy" ? "active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              setActiveTab("buy");
            }}
          >
            Satın Al
          </a>
        </li>
        <li>
          <a
            href="#"
            className={`tab-button ${activeTab === "desc" ? "active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              setActiveTab("desc");
            }}
          >
            Description
          </a>
        </li>
        <li>
          <a
            href="#"
            className={`tab-button ${activeTab === "reviews" ? "active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              setActiveTab("reviews");
            }}
          >
            Reviews
          </a>
        </li>
      </ul>

      <div className="tab-panel">
        <div
          className={`tab-panel-buy content ${
            activeTab === "buy" ? "active" : ""
          }`}
        >
          <p className="coming-soon-msg">
            🛒 Bu ürün yakında satışa çıkacaktır.
          </p>
        </div>

        <div
          className={`tab-panel-descriptions content ${
            activeTab === "desc" ? "active" : ""
          }`}
        >
          <div
            className="product-description"
            dangerouslySetInnerHTML={{ __html: singleProduct.description }}
          />
        </div>

        <Reviews
          active={activeTab === "reviews" ? "content active" : "content"}
          singleProduct={singleProduct}
          setSingleProduct={setSingleProduct}
          onReviewUpdate={onReviewUpdate}
        />
      </div>
    </div>
  );
};

Tabs.propTypes = {
  singleProduct: PropTypes.object.isRequired,
  setSingleProduct: PropTypes.func.isRequired,
  onReviewUpdate: PropTypes.func.isRequired,
};

export default Tabs;
