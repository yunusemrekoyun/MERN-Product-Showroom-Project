import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import Submenu from "./Submenu";
import "./HeaderBottom.css";

const HeaderBottom = () => {
  const { pathname } = useLocation();
  const [categories, setCategories] = useState([]);
  const [submenuData, setSubmenuData] = useState(null);
  const [submenuVisible, setSubmenuVisible] = useState(false);
  const timeoutRef = useRef(null);
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

  useEffect(() => {
    const handleDocumentMouseMove = (e) => {
      const headerElement = document.querySelector(".header-bottom");
      if (!headerElement?.contains(e.target)) {
        setSubmenuVisible(false);
        setSubmenuData(null);
      }
    };

    document.addEventListener("mousemove", handleDocumentMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleDocumentMouseMove);
    };
  }, []);

  const handleMouseEnter = (event, cat) => {
    clearTimeout(timeoutRef.current);
    const rect = event.currentTarget.getBoundingClientRect();
    setSubmenuData({
      items: cat.subcategories,
      parentCategoryId: cat._id,
      position: {
        top: rect.bottom + 2,
        left: rect.left,
      },
    });
    setSubmenuVisible(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      if (!submenuVisible) {
        setSubmenuData(null);
      }
    }, 150);
  };

  
  const handleSubmenuEnter = () => {
    clearTimeout(timeoutRef.current);
    setSubmenuVisible(true);
  };

  const handleSubmenuLeave = () => {
    setSubmenuVisible(false);
    timeoutRef.current = setTimeout(() => {
      setSubmenuData(null);
    }, 150);
  };

  return (
    <div className="header-bottom">
      <div className="header-menu-scroll">
        <div className="header-menu">
          <div className="menu-spacer" />

          <div className="menu-item">
            <Link
              to="/"
              className={`menu-link icon-link ${
                pathname === "/" ? "active" : ""
              }`}
            >
              <i className="bi bi-house"></i>
            </Link>
          </div>

          {categories.map((cat, index) => (
            <div
              key={cat._id}
              className={`menu-item ${
                index === categories.length - 1 ? "last-item" : ""
              }`}
              onMouseEnter={(e) => handleMouseEnter(e, cat)}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                to={`/shop?category=${cat._id}`}
                className={`menu-link ${
                  pathname.includes(cat.name) ? "active" : ""
                }`}
              >
                {cat.name.toUpperCase()}
              </Link>
            </div>
          ))}

          <div className="menu-spacer" />
        </div>
      </div>

      {submenuData && (
        <div className="submenu-wrapper">
          <Submenu
            subcategories={submenuData.items}
            position={submenuData.position}
            parentCategoryId={submenuData.parentCategoryId}
            onMouseEnter={handleSubmenuEnter}
            onMouseLeave={handleSubmenuLeave}
          />
        </div>
      )}
    </div>
  );
};

export default HeaderBottom;
