import { useState } from "react";
import PropTypes from "prop-types";
import ReviewsSection from "./ReviewsSection";
import "./PurchaseAndReviews.css"; // 👈 yeni CSS import

const PurchaseAndReviews = ({ productId }) => {
  const [activeTab, setActiveTab] = useState("buy");

  return (
    <section className="bottom-tabs-section">
      <div className="tab-header">
        <button
          className={activeTab === "buy" ? "active" : ""}
          onClick={() => setActiveTab("buy")}
        >
          Satın Al
        </button>
        <button
          className={activeTab === "reviews" ? "active" : ""}
          onClick={() => setActiveTab("reviews")}
        >
          Yorumlar
        </button>
      </div>

      {activeTab === "buy" && (
        <div className="purchase-links">
          <a
            href="https://trendyol.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="buy-btn">Trendyol&#39;da Satın Al</button>
          </a>
          <a
            href="https://n11.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="buy-btn">N11&#39;de Satın Al</button>
          </a>
        </div>
      )}

      {activeTab === "reviews" && <ReviewsSection productId={productId} />}
    </section>
  );
};
PurchaseAndReviews.propTypes = {
  productId: PropTypes.string.isRequired,
};
export default PurchaseAndReviews;