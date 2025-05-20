// src/components/Categories/CategoryItem.jsx
import PropTypes from "prop-types";
import "./CategoryItem.css";

const CategoryItem = ({ category }) => (
  <li className="category-item">
    <a href="#">
      <img
        src={`data:image/png;base64,${category.img}`}
        alt={category.name}
        className="category-image"
      />
      <span className="category-title">{category.name}</span>
    </a>
  </li>
);

CategoryItem.propTypes = {
  category: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string.isRequired,
    img: PropTypes.string.isRequired,
  }),
};

export default CategoryItem;
