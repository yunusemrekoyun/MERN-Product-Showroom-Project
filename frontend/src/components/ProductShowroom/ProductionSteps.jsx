import Slider from "react-slick";
import "./ProductionSteps.css"; // 👈 yeni CSS import'u

const ProductionSteps = () => {
  const steps = [
    {
      title: "Şekillendirme",
      text: "Ham çamur ustalar tarafından form verilerek şekillendirilir.",
      image: "/img/products/product1/1.png",
    },
    {
      title: "Boyama",
      text: "Kuruyan çamur geleneksel motiflerle tek tek boyanır.",
      image: "/img/products/product1/2.png",
    },
    {
      title: "Pişirme",
      text: "Fırında yüksek sıcaklıkta pişirilerek son formu verilir.",
      image: "/img/products/product1/3.png",
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <section className="production-steps-section">
      <h2 className="section-title">Üretim Aşamaları</h2>
      <Slider {...settings}>
        {steps.map((step, index) => (
          <div key={index} className="step-slide">
            <div className="step-image">
              <img src={step.image} alt={step.title} />
            </div>
            <div className="step-content">
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default ProductionSteps;
