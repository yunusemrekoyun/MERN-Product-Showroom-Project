import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./ReviewsSection.css"; // 👈 yeni CSS import

const ReviewsSection = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/product-reviews/${productId}`);
        if (!res.ok) throw new Error("Yorumlar alınamadı");
        const data = await res.json();
        if (!data.reviews || !Array.isArray(data.reviews))
          throw new Error("Hatalı veri");
        setReviews(data.reviews);
      } catch (err) {
        setError("Yorumlar alınamadı.");
        console.error(err.message);
      }
    };

    if (productId) fetchReviews();
  }, [productId, apiUrl]);

  const handleSubmit = async () => {
    if (!user) return alert("Yorum yapmak için giriş yapmalısınız.");
    if (!newReview.trim()) return;

    setSubmitting(true);

    try {
      const res = await fetch(`${apiUrl}/api/product-reviews/${productId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: newReview,
          rating: newRating,
          user: user._id || user.id,
        }),
      });

      if (!res.ok) throw new Error("Gönderim hatası");

      const updated = await res.json();
      setReviews(updated.reviews || []);
      setNewReview("");
      setNewRating(5);
    } catch (err) {
      alert("Yorum gönderilemedi.");
      console.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="reviews-section">
      <h4>Yorumlar</h4>
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : reviews.length === 0 ? (
        <p>Henüz yorum yapılmamış. İlk yorum yapan siz olun!</p>
      ) : (
        reviews.map((review, i) => (
          <div key={i} className="review-box">
            <p>
              <strong>{review.user?.username || "Anonim"}:</strong>{" "}
              {review.text}
            </p>
            <span>⭐ {review.rating}</span>
          </div>
        ))
      )}

      <div className="add-review">
        <h5>Yorum Ekle</h5>
        <textarea
          rows="3"
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
          placeholder="Yorumunuzu yazın..."
        />
        <div className="review-form-footer">
          <label>
            Puan:
            <select
              value={newRating}
              onChange={(e) => setNewRating(Number(e.target.value))}
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
          <button onClick={handleSubmit} disabled={submitting}>
            Gönder
          </button>
        </div>
      </div>
    </div>
  );
};

ReviewsSection.propTypes = {
  productId: PropTypes.string.isRequired,
};

export default ReviewsSection;
