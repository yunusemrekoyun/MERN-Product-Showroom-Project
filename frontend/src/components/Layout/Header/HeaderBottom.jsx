import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaThLarge,
  FaRegNewspaper,
  FaChevronDown,
} from "react-icons/fa";
import Submenu from "./Submenu";
import MobileDrawer from "./MobileDrawer";
import "./HeaderBottom.css";

const TRANSFORM_DURATION = 600;
const WIDTH_DURATION = 900;

const HeaderBottom = () => {
  const mobileNavRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [submenuData, setSubmenuData] = useState(null);
  const [openSubmenuId, setOpenSubmenuId] = useState(null);
  const [submenuVisible, setSubmenuVisible] = useState(false);
  const [mode, setMode] = useState("default");
  const [isAnimating, setIsAnimating] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isTouch, setIsTouch] = useState(false);
  const timeoutRef = useRef(null);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  // Touch & resize
  useEffect(() => {
    setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0);
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Fetch categories
  useEffect(() => {
    fetch(`${apiUrl}/api/categories`)
      .then((res) => res.json())
      .then(setCategories)
      .catch(console.error);
  }, [apiUrl]);
  // ——> Dinamik olarak tab-bar yüksekliğini ölç ve CSS değişkenine yaz
  useEffect(() => {
    if (!isMobile) return;
    const updateBottomNavHeight = () => {
      const navEl = mobileNavRef.current;
      if (navEl) {
        const h = navEl.getBoundingClientRect().height;
        document.documentElement.style.setProperty("--bottom-nav-h", `${h}px`);
      }
    };
    // İlk mount ve her resize sonrası
    updateBottomNavHeight();
    window.addEventListener("resize", updateBottomNavHeight);
    return () => window.removeEventListener("resize", updateBottomNavHeight);
  }, [isMobile]);
  // Desktop submenu handlers
  const handleMouseEnter = (e, cat) => {
    if (isMobile) return;
    clearTimeout(timeoutRef.current);
    const rect = e.currentTarget.getBoundingClientRect();
    const left = Math.max(rect.left + rect.width / 2 - 110, 12);
    setSubmenuData({
      items: cat.subcategories,
      parentCategoryId: cat._id,
      position: { top: rect.bottom + 4, left },
    });
    setSubmenuVisible(true);
  };
  const handleMouseLeave = () => {
    if (isMobile) return;
    timeoutRef.current = setTimeout(() => {
      if (!submenuVisible) setSubmenuData(null);
    }, 150);
  };
  const handleToggleSubmenu = (e, cat) => {
    if (isMobile) return;
    e.preventDefault();
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const left = Math.max(rect.left + rect.width / 2 - 110, 12);
    const top = rect.bottom + 12;
    const same = openSubmenuId === cat._id;
    setOpenSubmenuId(same ? null : cat._id);
    setSubmenuData(
      same
        ? null
        : {
            items: cat.subcategories,
            parentCategoryId: cat._id,
            position: { top, left },
          }
    );
  };

  // Mode change
  const handleModeChange = (newMode) => {
    if (newMode === "default") {
      if (isAnimating) return;
      setIsAnimating(true);
      setIsReady(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => setMode("default"), TRANSFORM_DURATION);
      setTimeout(() => {
        setIsAnimating(false);
        navigate("/");
      }, TRANSFORM_DURATION + WIDTH_DURATION);
      return;
    }
    if (mode === newMode || isAnimating) return;
    setMode(newMode);
    setIsAnimating(true);
    setTimeout(() => setIsReady(true), TRANSFORM_DURATION);
    setTimeout(
      () => setIsAnimating(false),
      TRANSFORM_DURATION + WIDTH_DURATION
    );
  };

  // Mobile drawer
  const handleMobileIcon = (type) =>
    setDrawerOpen((prev) => (prev === type ? null : type));

  // **MOBİL** alt nav
  if (isMobile) {
    return (
      <>
        <div
          className="mobile-bottom-nav liquid-glass-panel"
          ref={mobileNavRef} // <-- ref ekledik
        >
          <button
            onClick={() => {
              setDrawerOpen(null);
              handleModeChange("default");
            }}
          >
            {" "}
            <FaHome size={20} />
            <span>Ana Sayfa</span>
          </button>
          <button onClick={() => handleMobileIcon("shop")}>
            <FaThLarge size={20} />
            <span>Ürünler</span>
          </button>
          <button onClick={() => handleMobileIcon("blog")}>
            <FaRegNewspaper size={20} />
            <span>Blog</span>
          </button>
        </div>
        <MobileDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(null)}
          categories={categories}
        />
      </>
    );
  }
  // Desktop view
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
