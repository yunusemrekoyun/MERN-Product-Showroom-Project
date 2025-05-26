import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./HeaderBottom.css";

const HeaderBottom = () => {
  const { pathname } = useLocation();
  const [categories, setCategories] = useState([]);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/categories`);
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Kategoriler alınamadı:", error);
      }
    };
    fetchCategories();
  }, [apiUrl]);

  return (
    <div className="header-bottom">
      <div className="header-menu-scroll">
        <div className="header-menu">
          <div className="menu-item">
            <Link
              to="/"
              className={`menu-link icon-link ${pathname === "/" ? "active" : ""}`}
            >
              <i className="bi bi-house"></i>
            </Link>
          </div>

          {categories.map((cat) => (
            <div key={cat._id} className="menu-item has-submenu">
              <Link to={`/${cat.name}`} className="menu-link">
                {cat.name.toUpperCase()}
              </Link>
              <div className="submenu">
                {cat.subcategories.map((sub, i) => (
                  <Link to={`/${cat.name}/${sub}`} key={i}>
                    {sub}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeaderBottom;