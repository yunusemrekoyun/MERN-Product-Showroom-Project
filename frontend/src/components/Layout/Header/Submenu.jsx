import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import "./Submenu.css";

const Submenu = ({
  subcategories,
  position,
  parentCategory,
  onMouseEnter,
  onMouseLeave,
}) => {
  if (!subcategories || subcategories.length === 0) return null;

  return (
    <div
      className="submenu-container"
      style={{
        top: position?.top || 0,
        left: position?.left || 0,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {subcategories.map((sub, i) => (
        <Link key={i} to={`/${parentCategory}/${sub}`} className="submenu-item">
          {sub}
        </Link>
      ))}
    </div>
  );
};
Submenu.propTypes = {
  subcategories: PropTypes.arrayOf(PropTypes.string),
  position: PropTypes.shape({
    top: PropTypes.number,
    left: PropTypes.number
  }),
  parentCategory: PropTypes.string.isRequired,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func
};

export default Submenu;
