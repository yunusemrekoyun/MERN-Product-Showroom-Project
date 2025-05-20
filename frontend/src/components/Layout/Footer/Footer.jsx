import React from "react";
// import Policy from "../Policy/Policy";
import "./Footer.css";
// import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <React.Fragment>
      {/* <Policy /> */}
      <footer className="footer">
        <div className="subscribe-row">
          <div className="container">
            <div className="footer-row-wrapper">
              <div className="footer-subscribe-wrapper">
                <div className="footer-subscribe">
                  <div className="footer-subscribe-top">
                    <h3 className="subscribe-title">
                      Yeni Gelişmeler İçin Bültenimize Kaydolun{" "}
                    </h3>
                    <p className="subscribe-desc"></p>
                  </div>
                  <div className="footer-subscribe-bottom">
                    <form>
                      <input
                        type="text"
                        placeholder="Mail Adresinizi Giriniz."
                      />
                      <button className="btn">Kaydol</button>
                    </form>
                    <p className="privacy-text">
                      Kaydolarak şartları kabul ediyorum{" "}
                      <a href="#">
                        Şartlar ve Koşullar, Çerezler ve Gizlilik Politikamız.
                      </a>
                    </p>
                  </div>
                </div>
              </div>
              <div className="footer-contact-wrapper">
                <div className="footer-contact-info">
                  <h3 className="contact-title">
                    Bize Ulaşın <br />
                    (+90) 123 456 78 90
                  </h3>
                  <p className="contact-desc">
                    Mesai saatleri: <br />
                    Pazartesi - Cuma 9:00 - 18:00
                  </p>
                  <p className="privacy-text">
                    <strong>E-posta :</strong> info@example.com
                    <br />
                    <strong>Faks :</strong> (+800) 1234 5678 90
                  </p>
                </div>

                <div className="footer-contact-logo">
                  <img src="/logo/logo.png" alt="Logo" />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* </div> */}
        {/* <div className="widgets-row">
          <div className="container">
            <div className="footer-widgets">
              <div className="brand-info">
                <div className="footer-logo">
                  <Link to={"/"} className="logo">
                    LOGO
                  </Link>
                </div>
                <div className="footer-desc">
                  <p>
                    {" "}
                    Quis ipsum suspendisse ultrices gravida. Risus commodo
                    viverra maecenas accumsan lacus vel facilisis in termapol.
                  </p>
                </div>
                <div className="footer-contact">
                  <p>
                    <a href="tel:555 555 55 55">(+800) 1234 5678 90</a> –{" "}
                    <a href="mailto:info@example.com">info@example.com</a>
                  </p>
                </div>
              </div>
              <div className="widget-nav-menu">
                <h4>Information</h4>
                <ul className="menu-list">
                  <li>
                    <a href="#">About Us</a>
                  </li>
                  <li>
                    <a href="#">Privacy Policy</a>
                  </li>
                  <li>
                    <a href="#">Returns Policy</a>
                  </li>
                  <li>
                    <a href="#">Shipping Policy</a>
                  </li>
                  <li>
                    <a href="#">Dropshipping</a>
                  </li>
                </ul>
              </div>
              <div className="widget-nav-menu">
                <h4>Account</h4>
                <ul className="menu-list">
                  <li>
                    <a href="#">Dashboard</a>
                  </li>
                  <li>
                    <a href="#">My Orders</a>
                  </li>
                  <li>
                    <a href="#">My Wishlist</a>
                  </li>
                  <li>
                    <a href="#">Account details</a>
                  </li>
                  <li>
                    <a href="#">Track My Orders</a>
                  </li>
                </ul>
              </div>
              <div className="widget-nav-menu">
                <h4>Shop</h4>
                <ul className="menu-list">
                  <li>
                    <a href="#">Affiliate</a>
                  </li>
                  <li>
                    <a href="#">Bestsellers</a>
                  </li>
                  <li>
                    <a href="#">Discount</a>
                  </li>
                  <li>
                    <a href="#">Latest Products</a>
                  </li>
                  <li>
                    <a href="#">Sale Products</a>
                  </li>
                </ul>
              </div>
              <div className="widget-nav-menu">
                <h4>Categories</h4>
                <ul className="menu-list">
                  <li>
                    <a href="#">Women</a>
                  </li>
                  <li>
                    <a href="#">Men</a>
                  </li>
                  <li>
                    <a href="#">Bags</a>
                  </li>
                  <li>
                    <a href="#">Outerwear</a>
                  </li>
                  <li>
                    <a href="#">Shoes</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div> */}
        {/* <div className="copyright-row">
          <div className="container">
            <div className="footer-copyright">
              <div className="site-copyright">
                <p>
                  Copyright 2022 © E-Commerce Theme. All right reserved. Powered
                  by Emin Basbayan.
                </p>
              </div>
              <a href="#">
                <img src="/img/footer/cards.png" alt="" />
              </a>
              <div className="footer-menu">
                <ul className="footer-menu-list">
                  <li className="list-item">
                    <a href="#">Privacy Policy</a>
                  </li>
                  <li className="list-item">
                    <a href="#">Terms and Conditions</a>
                  </li>
                  <li className="list-item">
                    <a href="#">Returns Policy</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div> */}
      </footer>
    </React.Fragment>
  );
};

export default Footer;
