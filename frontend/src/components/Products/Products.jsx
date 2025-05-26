import { useEffect, useState } from "react";
import ProductItem from "./ProductItem";
import "./Products.css";
import { message } from "antd";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const visibleProducts = 5;
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // sayfalama parametreleri ekledik, ilk 20 ürünü alıyoruz
        const response = await fetch(`${apiUrl}/api/products?page=1&limit=20`);
        if (!response.ok) {
          message.error("Veri getirme başarısız.");
          return;
        }
        const result = await response.json();
        // result = { total, page, totalPages, products: [ … ] }
        setProducts(result.products);
      } catch (error) {
        console.error("Veri hatası:", error);
        message.error("Veri alınamadı.");
      }
    };
    fetchProducts();
  }, [apiUrl]);

  const maxIndex = Math.max(0, products.length - visibleProducts);

  const next = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const slideOffset = -(currentIndex * (100 / visibleProducts));

  return (
    <section className="products custom-products">
      <div className="container">
        <div className="section-title">
          <h2>Öne Çıkan Ürünler</h2>
        </div>

        <div className="product-slider-wrapper">
          <button className="custom-arrow prev" onClick={prev}>
            ❮
          </button>

          <div className="product-slider-window">
            <div
              className="product-slider-track"
              style={{
                transform: `translateX(${slideOffset}%)`,
              }}
            >
              {products.map((product) => (
                <div className="product-slide" key={product._id}>
                  <ProductItem productItem={product} />
                </div>
              ))}
            </div>
          </div>

          <button className="custom-arrow next" onClick={next}>
            ❯
          </button>
        </div>
      </div>
    </section>
  );
};

export default Products;
