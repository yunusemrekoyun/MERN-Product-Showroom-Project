// src/components/Layout/Header/HeaderBottom.jsx
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaChevronDown,
  FaHome,
  FaThLarge,
  FaRegNewspaper,
} from "react-icons/fa";
import Submenu from "./Submenu";
import "./HeaderBottom.css";

const HeaderBottom = () => {
  const [categories, setCategories] = useState([]);
  const [submenuData, setSubmenuData] = useState(null);
  const [submenuVisible, setSubmenuVisible] = useState(false);
  const [openSubmenuId, setOpenSubmenuId] = useState(null);
  const [isTouch, setIsTouch] = useState(false);
  const [mode, setMode] = useState("default");
  const [isAnimating, setIsAnimating] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const timeoutRef = useRef(null);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  // Touch detection
  useEffect(() => {
    setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  // Fetch categories once
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

  // Hide submenu on outside hover
  useEffect(() => {
    const handler = (e) => {
      const el = document.querySelector(".header-bottom");
      if (!el?.contains(e.target)) {
        setSubmenuVisible(false);
        setSubmenuData(null);
        setOpenSubmenuId(null);
      }
    };
    document.addEventListener("mousemove", handler);
    return () => document.removeEventListener("mousemove", handler);
  }, []);

  const handleMouseEnter = (e, cat) => {
    if (isTouch) return;
    clearTimeout(timeoutRef.current);
    const rect = e.currentTarget.getBoundingClientRect();
    const left = Math.max(rect.left + rect.width / 2 - 110, 12);
    setSubmenuData({
      items: cat.subcategories,
      parentCategoryId: cat._id,
      position: {
        top: rect.bottom + 4, // scrollY kaldırıldı
        left,
      },
    });
    setSubmenuVisible(true);
  };

  const handleMouseLeave = () => {
    if (isTouch) return;
    timeoutRef.current = setTimeout(() => {
      if (!submenuVisible) setSubmenuData(null);
    }, 150);
  };

  const handleToggleSubmenu = (e, cat) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const top = rect.bottom + 12; // sadece rect.bottom
    const submenuWidth = 220;
    const left = Math.max(
      rect.left + rect.width / 2 - submenuWidth / 2 + 12,
      12
    );
    const isSame = openSubmenuId === cat._id;
    setOpenSubmenuId(isSame ? null : cat._id);
    setSubmenuData(
      isSame
        ? null
        : {
            items: cat.subcategories,
            parentCategoryId: cat._id,
            position: { top, left },
          }
    );
  };

  const TRANSFORM_DURATION = 600;
  const WIDTH_DURATION = 900;
  const handleModeChange = (newMode) => {
    // KAPANIŞ
    if (newMode === "default") {
      if (isAnimating) return;
      setIsAnimating(true); // transform animasyonu başlasın
      setIsReady(false); // içerik hemen kaybolsun
      window.scrollTo({ top: 0, behavior: "smooth" });
      // 1) 600ms sonra .expanded sınıfı kalksın (width transition tetiklensin)
      setTimeout(() => {
        setMode("default");
      }, TRANSFORM_DURATION);

      // 2) 600 + 900 = 1500ms sonra anim bitir ve navigate et
      setTimeout(() => {
        setIsAnimating(false);
        navigate("/");
      }, TRANSFORM_DURATION + WIDTH_DURATION);

      return;
    }

    // AÇILIŞ (aynı kaldı)
    if (mode === newMode || isAnimating) return;
    setMode(newMode);
    setIsAnimating(true);
    setTimeout(() => setIsReady(true), TRANSFORM_DURATION);
    setTimeout(
      () => setIsAnimating(false),
      TRANSFORM_DURATION + WIDTH_DURATION
    );
  };

  return (
    <div className="header-bottom">
      <div
        className={[
          "liquid-glass-panel",
          isAnimating && "animating",
          mode !== "default" && "expanded",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div className="icon-container">
          <button
            onClick={() => handleModeChange("default")}
            className={mode === "default" ? "active" : ""}
          >
            <FaHome size={18} />
            <span>Ana Sayfa</span>
          </button>
          <button
            onClick={() => handleModeChange("shop")}
            className={mode === "shop" ? "active" : ""}
          >
            <FaThLarge size={18} />
            <span>Ürünler</span>
          </button>
          <button
            onClick={() => handleModeChange("blog")}
            className={mode === "blog" ? "active" : ""}
          >
            <FaRegNewspaper size={18} />
            <span>Blog</span>
          </button>
        </div>

        {mode !== "default" && isReady && (
          <div className="liquid-content-area active">
            {mode === "shop" &&
              categories.map((cat) => (
                <div
                  key={cat._id}
                  className="menu-item"
                  onMouseEnter={(e) => handleMouseEnter(e, cat)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="menu-link-wrapper">
                    <Link
                      to={`/shop?category=${cat._id}`}
                      className="menu-link"
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
            {mode === "blog" && (
              <>
                <div className="blog-link">
                  <Link to="/blog/1" className="menu-link">
                    Yeni Ürünler
                  </Link>
                </div>
                <div className="blog-link">
                  <Link to="/blog/2" className="menu-link">
                    Kampanyalar
                  </Link>
                </div>
                <div className="blog-link">
                  <Link to="/blog/3" className="menu-link">
                    S.S.S.
                  </Link>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {submenuData && (
        <div className="submenu-wrapper">
          <Submenu
            subcategories={submenuData.items}
            position={submenuData.position}
            parentCategoryId={submenuData.parentCategoryId}
            onMouseEnter={() => setSubmenuVisible(true)}
            onMouseLeave={handleMouseLeave}
          />
        </div>
      )}
    </div>
  );
};

export default HeaderBottom;
