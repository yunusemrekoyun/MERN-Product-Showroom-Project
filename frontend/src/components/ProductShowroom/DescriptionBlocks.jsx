import { useEffect, useRef, useState } from "react";
import "./DescriptionBlocks.css"; // 👈 yeni CSS import'u

const DescriptionBlocks = () => {
  const blocksRef = useRef([]);
  const [visibleBlocks, setVisibleBlocks] = useState([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.dataset.index);
            setVisibleBlocks((prev) => [...new Set([...prev, index])]);
          }
        });
      },
      { threshold: 0.2 }
    );

    blocksRef.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const blocks = [
    {
      title: "Doğal Malzeme",
      text: "Ürünlerimiz tamamen doğal çamur ve sır kullanılarak elde şekillendirilmiştir.",
      image: "/img/products/product1/2.png",
    },
    {
      title: "El İşçiliği",
      text: "Her bir parça ustalarımız tarafından tek tek boyanır ve desenlenir.",
      image: "/img/products/product1/3.png",
    },
  ];

  return (
    <section id="description-blocks" className="desc-section">
      {blocks.map((block, index) => (
        <div
          key={index}
          className={`desc-block ${
            visibleBlocks.includes(index) ? "visible" : ""
          }`}
          ref={(el) => (blocksRef.current[index] = el)}
          data-index={index}
        >
          <div className="desc-image">
            <img src={block.image} alt={block.title} />
          </div>
          <div className="desc-content">
            <h3>{block.title}</h3>
            <p>{block.text}</p>
          </div>
        </div>
      ))}
    </section>
  );
};

export default DescriptionBlocks;
