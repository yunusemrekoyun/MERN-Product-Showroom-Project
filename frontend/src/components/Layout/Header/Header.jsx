// Yeni yapıya göre güncellenmiş Header.jsx (JS destekli submenu açılma)

import { useContext, useState, useRef } from "react";
import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";
import { CartContext } from "../../../context/CartProvider";
import "./Header.css";

const Header = ({ setIsSearchShow }) => {
  const { cartItems } = useContext(CartContext);
  const user = localStorage.getItem("user");
  const { pathname } = useLocation();

  const [activeMenu, setActiveMenu] = useState(null);
  const timeoutRef = useRef(null);

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
              LOGO
            </Link>
          </div>
          <div className="header-center">
            <input
              type="text"
              placeholder="Arama"
              className="search-input"
              onClick={() => setIsSearchShow(true)}
            />
          </div>
          <div className="header-right">
            <Link to="/auth" className="header-icon">
              <i className="bi bi-person"></i>
              <span>Üye Girişi</span>
            </Link>
            <Link to="/auth" className="header-icon">
              <i className="bi bi-person-plus"></i>
              <span>Üye Ol</span>
            </Link>
            <Link to="/cart" className="header-icon">
              <i className="bi bi-bag"></i>
              <span>Sepetim</span>
              {cartItems.length > 0 && (
                <span className="header-cart-count">{cartItems.length}</span>
              )}
            </Link>
            {user && (
              <button
                className="logout-button"
                onClick={() => {
                  if (window.confirm("Çıkış yapmak istiyor musunuz?")) {
                    localStorage.removeItem("user");
                    window.location.href = "/";
                  }
                }}
              >
                <i className="bi bi-box-arrow-right"></i>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="header-bottom">
        <div className="container header-menu">
          <div className="menu-item">
            <Link
              to="/"
              className={`menu-link icon-link ${pathname === "/" && "active"}`}
            >
              <i className="bi bi-house"></i>
            </Link>
          </div>

          <div
            className="menu-item"
            onMouseEnter={() => handleMouseEnter("3d")}
            onMouseLeave={handleMouseLeave}
          >
            <Link to="/3d" className="menu-link">
              3D TASARIMLAR
            </Link>
            <div className={`submenu ${activeMenu === "3d" ? "show" : ""}`}>
              <Link to="/3d/masaustu">Masaüstü Objeler</Link>
              <Link to="/3d/dekoratif">Dekoratif Tasarımlar</Link>
            </div>
          </div>

          <div
            className="menu-item"
            onMouseEnter={() => handleMouseEnter("el")}
            onMouseLeave={handleMouseLeave}
          >
            <Link to="/el-yapimi" className="menu-link">
              EL YAPIMI
            </Link>
            <div className={`submenu ${activeMenu === "el" ? "show" : ""}`}>
              <Link to="/el-yapimi/ahsap">Ahşap Ürünler</Link>
              <Link to="/el-yapimi/kumas">Kumaş Ürünler</Link>
            </div>
          </div>

          <div
            className="menu-item"
            onMouseEnter={() => handleMouseEnter("seramik")}
            onMouseLeave={handleMouseLeave}
          >
            <Link to="/seramik" className="menu-link">
              SERAMİK KOLEKSİYONU
            </Link>
            <div
              className={`submenu ${activeMenu === "seramik" ? "show" : ""}`}
            >
              <Link to="/seramik/tabak">Tabaklar</Link>
              <Link to="/seramik/kupa">Kupalar</Link>
            </div>
          </div>

          <div
            className="menu-item"
            onMouseEnter={() => handleMouseEnter("cam")}
            onMouseLeave={handleMouseLeave}
          >
            <Link to="/cam" className="menu-link">
              CAM KOLEKSİYONU
            </Link>
            <div className={`submenu ${activeMenu === "cam" ? "show" : ""}`}>
              <Link to="/cam/vazo">Vazolar</Link>
              <Link to="/cam/sus">Süs Eşyaları</Link>
            </div>
          </div>

          <div
            className="menu-item"
            onMouseEnter={() => handleMouseEnter("pet")}
            onMouseLeave={handleMouseLeave}
          >
            <Link to="/pet" className="menu-link">
              PET ÜRÜNLERİ
            </Link>
            <div className={`submenu ${activeMenu === "pet" ? "show" : ""}`}>
              <Link to="/pet/oyuncak">Oyuncaklar</Link>
              <Link to="/pet/mama">Mama Kapları</Link>
            </div>
          </div>

          <div
            className="menu-item"
            onMouseEnter={() => handleMouseEnter("aksesuar")}
            onMouseLeave={handleMouseLeave}
          >
            <Link to="/aksesuar" className="menu-link">
              AKSESUAR & YAŞAM
            </Link>
            <div
              className={`submenu ${activeMenu === "aksesuar" ? "show" : ""}`}
            >
              <Link to="/aksesuar/taki">Takı & Aksesuar</Link>
              <Link to="/aksesuar/ev">Ev Dekoru</Link>
            </div>
          </div>

          <div
            className="menu-item"
            onMouseEnter={() => handleMouseEnter("anneler")}
            onMouseLeave={handleMouseLeave}
          >
            <Link to="/anneler-gunu" className="menu-link">
              ANNELER GÜNÜ HEDİYESİ
            </Link>
            <div
              className={`submenu ${activeMenu === "anneler" ? "show" : ""}`}
            >
              <Link to="/anneler-gunu/kisiye-ozel">Kişiye Özel</Link>
              <Link to="/anneler-gunu/hazir-set">Hazır Setler</Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  setIsSearchShow: PropTypes.func,
};

export default Header;
