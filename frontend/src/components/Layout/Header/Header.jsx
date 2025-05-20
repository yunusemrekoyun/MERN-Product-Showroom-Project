import { useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
// import { CartContext } from "../../../context/CartProvider";
import "./Header.css";
import Search from "../../Modals/Search/Search";

const Header = () => {
  // const { cartItems } = useContext(CartContext);
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
              <img src="/logo/logo.png" alt="Site Logo" className="site-logo" />
            </Link>
          </div>
          <div className="header-center">
            <Search />
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
            {/* <Link to="/cart" className="header-icon">
              <i className="bi bi-bag"></i>
              <span>Sepetim</span>
              {cartItems.length > 0 && (
                <span className="header-cart-count">{cartItems.length}</span>
              )}
            </Link> */}
            {user && (
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

          {/* Alt Menü Kategorileri */}
          {[
            {
              key: "3d",
              name: "3D TASARIMLAR",
              links: [
                ["/3d/masaustu", "Masaüstü Objeler"],
                ["/3d/dekoratif", "Dekoratif Tasarımlar"],
              ],
            },
            {
              key: "el",
              name: "EL YAPIMI",
              links: [
                ["/el-yapimi/ahsap", "Ahşap Ürünler"],
                ["/el-yapimi/kumas", "Kumaş Ürünler"],
              ],
            },
            {
              key: "seramik",
              name: "SERAMİK KOLEKSİYONU",
              links: [
                ["/seramik/tabak", "Tabaklar"],
                ["/seramik/kupa", "Kupalar"],
              ],
            },
            {
              key: "cam",
              name: "CAM KOLEKSİYONU",
              links: [
                ["/cam/vazo", "Vazolar"],
                ["/cam/sus", "Süs Eşyaları"],
              ],
            },
            {
              key: "pet",
              name: "PET ÜRÜNLERİ",
              links: [
                ["/pet/oyuncak", "Oyuncaklar"],
                ["/pet/mama", "Mama Kapları"],
              ],
            },
            {
              key: "aksesuar",
              name: "AKSESUAR & YAŞAM",
              links: [
                ["/aksesuar/taki", "Takı & Aksesuar"],
                ["/aksesuar/ev", "Ev Dekoru"],
              ],
            },
            {
              key: "anneler",
              name: "ANNELER GÜNÜ HEDİYESİ",
              links: [
                ["/anneler-gunu/kisiye-ozel", "Kişiye Özel"],
                ["/anneler-gunu/hazir-set", "Hazır Setler"],
              ],
            },
          ].map(({ key, name, links }) => (
            <div
              key={key}
              className="menu-item"
              onMouseEnter={() => handleMouseEnter(key)}
              onMouseLeave={handleMouseLeave}
            >
              <Link to={`/${key}`} className="menu-link">
                {name}
              </Link>
              <div className={`submenu ${activeMenu === key ? "show" : ""}`}>
                {links.map(([url, label]) => (
                  <Link to={url} key={url}>
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
