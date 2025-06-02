import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content container">
        {/* Abone Ol */}
        <div className="footer-section subscribe">
          <h4 className="subscribe-title">
            Yeni Gelişmeler İçin Bültenimize Kaydolun
          </h4>
          <form className="subscribe-form">
            <input
              type="email"
              placeholder="Mail Adresinizi Giriniz."
              required
            />
            <button type="submit" className="subscribe-btn">
              Kaydol
            </button>
          </form>
          <p className="privacy-text">
            Kaydolarak&nbsp;
            <Link to="/policy" className="footer-link">
              Şartlar ve Koşullar
            </Link>
            ,&nbsp;
            <Link to="/privacy" className="footer-link">
              Gizlilik Politikamız
            </Link>
            ’ı kabul ediyorum.
          </p>
        </div>

        {/* Site Haritası */}
        <div className="footer-section sitemap">
          <h4 className="sitemap-title">Site Haritası</h4>
          <ul className="sitemap-list">
            <li>
              <Link to="/">Ana Sayfa</Link>
            </li>
            <li>
              <Link to="/shop">Mağaza</Link>
            </li>
            <li>
              <Link to="/blog">Blog</Link>
            </li>
            <li>
              <Link to="/contact">İletişim</Link>
            </li>
            <li>
              <Link to="/cart">Sepetim</Link>
            </li>
            <li>
              <Link to="/account">Hesabım</Link>
            </li>
            <li>
              <Link to="/login">Giriş Yap</Link>
            </li>
            <li>
              <Link to="/register">Kayıt Ol</Link>
            </li>
          </ul>
        </div>

        {/* İletişim */}
        <div className="footer-section contact">
          <div className="contact-info">
            <h4 className="contact-title">Bize Ulaşın</h4>
            <p className="contact-phone">(+90) 123 456 78 90</p>
            <p className="contact-hours">Mesai: Pzt–Cum 9:00–18:00</p>
            <p className="contact-email">
              <strong>E-posta:</strong> info@example.com
            </p>
            <p className="contact-fax">
              <strong>Faks:</strong> (+800) 1234 5678 90
            </p>
          </div>
          <div className="footer-logo">
            <img src="/logo/logo.png" alt="Logo" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
