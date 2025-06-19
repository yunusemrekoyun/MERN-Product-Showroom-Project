import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Modal } from "antd";
import Search from "../../Modals/Search/Search";
import "./Header.css";

const { confirm } = Modal;

const Header = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header>
      <div className="header-top">
        <div className="container header-wrapper">
          <div className="header-left">
            <Link to="/" className="logo">
              <img src="/logo/logo.png" alt="Site Logo" className="site-logo" />
            </Link>
          </div>

          {!isMobile && (
            <div className="header-center">
              <Search />
            </div>
          )}

          <div className="header-right">
            {isMobile && (
              <div
                className="mobile-search-icon"
                onClick={() => setShowMobileSearch((prev) => !prev)}
              >
                <i className="bi bi-search"></i>
              </div>
            )}

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
                    confirm({
                      title: "Çıkış Yap",
                      content: "Çıkış yapmak istediğinize emin misiniz?",
                      okText: "Evet",
                      cancelText: "Hayır",
                      onOk() {
                        localStorage.removeItem("user");
                        window.location.href = "/";
                      },
                    });
                  }}
                >
                  <i className="bi bi-box-arrow-right"></i>
                  <span>Çıkış</span>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobil arama kutusu: geçişli şekilde */}
        {isMobile && (
          <div
            className={`mobile-search-area ${showMobileSearch ? "show" : ""}`}
          >
            <Search />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
