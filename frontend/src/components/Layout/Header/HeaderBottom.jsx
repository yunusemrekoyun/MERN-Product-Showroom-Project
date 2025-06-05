import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import Submenu from "./Submenu";
import { FaChevronDown } from "react-icons/fa";
import "./HeaderBottom.css";

const HeaderBottom = () => {
  const { pathname } = useLocation();
  const [categories, setCategories] = useState([]);
  const [submenuData, setSubmenuData] = useState(null);
  const [submenuVisible, setSubmenuVisible] = useState(false);
  const [openSubmenuId, setOpenSubmenuId] = useState(null);
  const [isTouch, setIsTouch] = useState(false);
  const timeoutRef = useRef(null);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const isTouchDevice = () =>
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    setIsTouch(isTouchDevice());
  }, []);

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
        setOpenSubmenuId(null);
      }
    };

    document.addEventListener("mousemove", handleDocumentMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleDocumentMouseMove);
    };
  }, []);

  const handleMouseEnter = (event, cat) => {
    if (isTouch) return;
    clearTimeout(timeoutRef.current);
    const rect = event.currentTarget.getBoundingClientRect();
    const calculatedLeft = rect.left + rect.width / 2 - 110;
    const left = Math.max(calculatedLeft, 12);
    setSubmenuData({
      items: cat.subcategories,
      parentCategoryId: cat._id,
      position: {
        top: rect.bottom + window.scrollY + 4,
        left: left,
      },
    });
    setSubmenuVisible(true);
  };

  const handleMouseLeave = () => {
    if (isTouch) return;
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

  const handleToggleSubmenu = (e, cat) => {
    e.preventDefault();
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;
    const isSame = openSubmenuId === cat._id;

    const submenuWidth = 220;
    const calculatedLeft = rect.left + rect.width / 2 - submenuWidth / 2 + 12;
    const left = Math.max(calculatedLeft, 12);
    const top = rect.bottom + scrollY + 12;

    setOpenSubmenuId(isSame ? null : cat._id);
    setSubmenuData(
      isSame
        ? null
        : {
            items: cat.subcategories,
            parentCategoryId: cat._id,
            position: {
              top,
              left,
            },
          }
    );
  };

  return (
    <div className="header-bottom">
      <div className="header-menu-outer">
        <div className="header-menu-inner">
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

          {categories.map((cat) => (
            <div
              key={cat._id}
              className="menu-item"
              onMouseEnter={(e) => handleMouseEnter(e, cat)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="menu-link-wrapper">
                <Link
                  to={`/shop?category=${cat._id}`}
                  className={`menu-link ${
                    pathname.includes(cat.name) ? "active" : ""
                  }`}
                >
                  {cat.name.toUpperCase()}
                </Link>
                {isTouch && (
                  <button
                    className="submenu-toggle"
                    onClick={(e) => handleToggleSubmenu(e, cat)}
                  >
                    <FaChevronDown size={12} />
                  </button>
                )}
              </div>
            </div>
          ))}
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
