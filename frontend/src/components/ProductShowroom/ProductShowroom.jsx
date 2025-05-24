import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import HeroImage from "./HeroImage";
import DescriptionBlocks from "./DescriptionBlocks";
// import ProductionSteps from "./ProductionSteps";
import PurchaseAndReviews from "./PurchaseAndReviews";
import "./ProductShowroom.css"; // Yeni CSS dosyası

const ProductShowroom = () => {
  const { id: productId } = useParams();
  const [product, setProduct] = useState(null);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const url = `${apiUrl}/api/products/${productId}`;
        console.log("İstek atılan URL:", url); // ✨ ekle bunu
        const res = await fetch(url);
        if (!res.ok) throw new Error("Ürün bulunamadı");
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error("Ürün getirme hatası:", err);
      }
    };

    if (productId) fetchProduct();
  }, [productId, apiUrl]);

  if (!product) return <div className="loading">Ürün yükleniyor...</div>;

  return (
    <>
      <HeroImage product={product} />
      <DescriptionBlocks />
      {/* <ProductionSteps /> */}
      <PurchaseAndReviews productId={product._id} />
    </>
  );
};

export default ProductShowroom;
