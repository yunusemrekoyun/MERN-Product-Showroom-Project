import PropTypes from "prop-types";
import "./CategoryItem.css";

const CategoryItem = ({ category }) => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  return (
    <li className="category-item">
      <a href="#">
        <img
          src={`${apiUrl}/api/categories/${category._id}/image`}
          alt={category.name}
          className="category-image"
          loading="lazy"
        />
        <span className="category-title">{category.name}</span>
      </a>
    </li>
  );
};

CategoryItem.propTypes = {
  category: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default CategoryItem;
