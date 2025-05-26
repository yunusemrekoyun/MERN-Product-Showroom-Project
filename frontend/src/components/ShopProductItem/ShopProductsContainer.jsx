import { useState, useEffect, useCallback } from "react";
import ShopProductItem from "./ShopProductItem";
import "./ShopProductsContainer.css";

const ShopProductsContainer = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const limit = 20;

  const fetchProducts = useCallback(async () => {
    if (!hasMore) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${apiUrl}/api/products?page=${page}&limit=${limit}`
      );
      if (!res.ok) throw new Error("Ürünler alınamadı");
      const result = await res.json();
      // Eğer backend pagination objesi dönerse:
      // const { products: newOnes, totalPages } = result;
      // Biz backend'in sadece dizi döndürdüğünü varsayıyorsak:
      const newOnes = Array.isArray(result) ? result : result.products;
      setProducts((prev) => [...prev, ...newOnes]);
      if (newOnes.length < limit) setHasMore(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, page, hasMore]);

  // Sayfa değiştikçe çek
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Scroll’da en alta gelince sayfayı artır
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 100 &&
        !loading &&
        hasMore
      ) {
        setPage((p) => p + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  return (
    <div className="shop-products-container">
      <div className="shop-products-grid">
        {products.map((p) => (
          <ShopProductItem key={p._id} product={p} />
        ))}
      </div>
      {loading && <p style={{ textAlign: "center" }}>Yükleniyor...</p>}
      {!hasMore && <p style={{ textAlign: "center" }}>Daha fazla ürün yok.</p>}
    </div>
  );
};

export default ShopProductsContainer;
