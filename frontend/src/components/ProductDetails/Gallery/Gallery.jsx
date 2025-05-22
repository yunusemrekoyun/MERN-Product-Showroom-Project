// src/components/ProductDetails/Gallery/Gallery.jsx
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Slider from "react-slick";
import "./Gallery.css";

function PrevBtn({ onClick }) {
  return (
    <button
      className="glide__arrow glide__arrow--left"
      data-glide-dir="<"
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
      data-glide-dir=">"
      onClick={onClick}
      style={{ zIndex: 2 }}
    >
      <i className="bi bi-chevron-right" />
    </button>
  );
}
NextBtn.propTypes = { onClick: PropTypes.func };

const Gallery = ({ singleProduct }) => {
  const [activeImg, setActiveImg] = useState({
    img: "",
    imgIndex: 0,
  });

  useEffect(() => {
    // ilk base64 string’i alıyoruz
    setActiveImg({
      img: singleProduct.img[0],
      imgIndex: 0,
    });
  }, [singleProduct.img]);

  const sliderSettings = {
    dots: false,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <NextBtn />,
    prevArrow: <PrevBtn />,
  };

  return (
    <div className="product-gallery">
      <div className="single-image-wrapper">
        <img
          src={`data:image/png;base64,${activeImg.img}`}
          id="single-image"
          alt={singleProduct.name}
        />
      </div>
      <div className="product-thumb">
        <div className="glide__track" data-glide-el="track">
          <ol className="gallery-thumbs glide__slides">
            <Slider {...sliderSettings}>
              {singleProduct.img.map((itemImg, index) => (
                <li
                  className="glide__slide"
                  key={index}
                  onClick={() =>
                    setActiveImg({
                      img: itemImg,
                      imgIndex: index,
                    })
                  }
                >
                  <img
                    src={`data:image/png;base64,${itemImg}`}
                    alt={`${singleProduct.name} thumbnail ${index + 1}`}
                    className={`img-fluid ${
                      activeImg.imgIndex === index ? "active" : ""
                    }`}
                  />
                </li>
              ))}
            </Slider>
          </ol>
        </div>
        <div className="glide__arrows" data-glide-el="controls"></div>
      </div>
    </div>
  );
};

Gallery.propTypes = {
  singleProduct: PropTypes.shape({
    name: PropTypes.string,
    img: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};

export default Gallery;
