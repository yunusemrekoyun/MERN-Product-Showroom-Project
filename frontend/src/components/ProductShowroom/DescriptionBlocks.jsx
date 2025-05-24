import { useEffect } from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';
import "./DescriptionBlocks.css";

const DescriptionBlocks = () => {
  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: false,
      offset: 100,
      easing: "ease-in-out"
    });
  }, []);

  const blocks = [
    {
      title: "Doğal Malzeme",
      text: "Ürünlerimiz tamamen doğal çamur ve sır kullanılarak elde şekillendirilmiştir.",
      image: "/img/products/product1/2.png",
      aos: "fade-up-right"
    },
    {
      title: "El İşçiliği",
      text: "Her bir parça ustalarımız tarafından tek tek boyanır ve desenlenir.",
      image: "/img/products/product1/3.png",
      aos: "fade-up-left"
    },
  ];

  return (
    <section id="description-blocks" className="desc-section">
      {blocks.map((block, index) => (
        <div
          key={index}
          className="desc-block"
          data-aos={block.aos}
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