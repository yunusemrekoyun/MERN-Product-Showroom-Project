import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import "./register.css";

const Register = () => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("user", JSON.stringify(data));
        message.success("Kayıt başarılı.");
        navigate("/");
      } else {
        message.error("Kayıt başarısız.");
      }
    } catch (err) {
      console.error("Register error:", err);
      message.error("Bir hata oluştu.");
    }
  };

  return (
    <div className="register-page mirror-layout">
      {/* Sağ tarafa geçmiş görsel + metin */}
      <div className="register-right mirror-visual">
        <div className="right-content">
          <h2>Birlikte büyüyoruz</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
            enim ad minim veniam, quis nostrud exercitation ullamco laboris
            nisi ut aliquip ex ea commodo consequat.
          </p>
        </div>
      </div>

      {/* Sol tarafa geçmiş form */}
      <div className="register-left mirror-form">
        <div className="register-box">
          <div className="text-center">
<img src="/logo/logo.png" alt="Logo" className="auth-logo" />           
      
          </div>

          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label htmlFor="username">Kullanıcı Adı</label>
              <input
                type="text"
                name="username"
                id="username"
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">E-posta</label>
              <input
                type="email"
                name="email"
                id="email"
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Şifre</label>
              <input
                type="password"
                name="password"
                id="password"
                onChange={handleInputChange}
                required
              />
            </div>

            <button type="submit" className="btn-register-main">
              KAYIT OL
            </button>
          </form>

          <div className="login-prompt">
            <span>Zaten bir hesabınız var mı?</span>
            <button
              type="button"
              className="btn-login-alt"
              onClick={() => navigate("/login")}
            >
              GİRİŞ YAP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;