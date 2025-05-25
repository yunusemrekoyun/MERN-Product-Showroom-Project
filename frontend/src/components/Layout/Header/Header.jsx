import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Search from "../../Modals/Search/Search";
import "./Header.css";

const Header = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const { pathname } = useLocation();
  const [categories, setCategories] = useState([]);
  const [activeMenu, setActiveMenu] = useState(null);
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

  const handleMouseEnter = (key) => {
    clearTimeout(timeoutRef.current);
    setActiveMenu(key);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 200);
  };

  return (
    <header>
      <div className="header-top">
        <div className="container header-wrapper">
          <div className="header-left">
            <Link to="/" className="logo">
              <img src="/logo/logo.png" alt="Site Logo" className="site-logo" />
            </Link>
          </div>
          <div className="header-center">
            <Search />
          </div>
          <div className="header-right">
            {!user ? (
              <>
                <Link to="/login" className="header-icon">
                  <i className="bi bi-person"></i>
                  <span>Üye Girişi</span>
                </Link>
                <Link to="/register" className="header-icon">
                  <i className="bi bi-person-plus"></i>
                  <span>Üye Ol</span>
                </Link>
              </>
            ) : (
              <>
                <Link to="/account" className="header-icon user-info">
                  <i className="bi bi-person-circle"></i>
                  <span>{user.username}</span>
                </Link>
                <Link
                  to="/"
                  className="header-icon"
                  onClick={(e) => {
                    e.preventDefault();
                    if (window.confirm("Çıkış yapmak istiyor musunuz?")) {
                      localStorage.removeItem("user");
                      window.location.href = "/";
                    }
                  }}
                >
                  <i className="bi bi-box-arrow-right"></i>
                  <span>Çıkış</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="header-bottom">
        <div className="container header-menu-scroll">
          <div className="header-menu">
            <div className="menu-item">
              <Link
                to="/"
                className={`menu-link icon-link ${pathname === "/" && "active"}`}
              >
                <i className="bi bi-house"></i>
              </Link>
            </div>

            {categories.map((cat) => (
              <div
                key={cat._id}
                className="menu-item"
                onMouseEnter={() => handleMouseEnter(cat._id)}
                onMouseLeave={handleMouseLeave}
              >
                <Link to={`/${cat.name}`} className="menu-link">
                  {cat.name.toUpperCase()}
                </Link>
                <div className={`submenu ${activeMenu === cat._id ? "show" : ""}`}>
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
    </header>
  );
};

export default Header;