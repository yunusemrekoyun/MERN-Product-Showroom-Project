import { useState } from "react";
import PropTypes from "prop-types";
import Slider from "react-slick";
import "./Gallery.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
function PrevBtn({ onClick }) {
  return (
    <button
      className="glide__arrow glide__arrow--left"
      onClick={onClick}
      style={{ zIndex: 2 }}
    >
      <i className="bi bi-chevron-left" />
    </button>
  );
}
PrevBtn.propTypes = { onClick: PropTypes.func };

function NextBtn({ onClick }) {
  return (
    <button
      className="glide__arrow glide__arrow--right"
      onClick={onClick}
      style={{ zIndex: 2 }}
    >
      <i className="bi bi-chevron-right" />
    </button>
  );
}
NextBtn.propTypes = { onClick: PropTypes.func };

const Gallery = ({ singleProduct }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const sliderSettings = {
    dots: false,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <NextBtn />,
    prevArrow: <PrevBtn />,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  const renderImageUrl = (index) =>
    `${apiUrl}/api/products/${singleProduct._id}/image/${index}`;

  return (
    <div className="product-gallery">
      <div className="single-image-wrapper">
        <img
          src={renderImageUrl(activeIndex)}
          id="single-image"
          alt={singleProduct.name}
          loading="lazy"
        />
      </div>
      <div className="product-thumb">
       
            <Slider {...sliderSettings}>
              {singleProduct.img.map((_, index) => (
                <div
                  className="glide__slide"
                  key={index}
                  onClick={() => setActiveIndex(index)}
                >
                  <img
                    src={renderImageUrl(index)}
                    alt={`${singleProduct.name} thumbnail ${index + 1}`}
                    className={`img-fluid ${
                      activeIndex === index ? "active" : ""
                    }`}
                    loading="lazy"
                  />
                </div>
              ))}
            </Slider>
        
        <div className="glide__arrows" data-glide-el="controls"></div>
      </div>
    </div>
  );
};

Gallery.propTypes = {
  singleProduct: PropTypes.shape({
    name: PropTypes.string,
    _id: PropTypes.string.isRequired,
    img: PropTypes.array.isRequired, // içeriği kullanmıyoruz, sadece uzunluğu için
  }).isRequired,
};

export default Gallery;
