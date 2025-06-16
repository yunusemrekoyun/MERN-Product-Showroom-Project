import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import "./login.css";

const Login = () => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("user", JSON.stringify(data));
        message.success("Giriş başarılı.");
        if (data.role === "admin") {
          window.location.href = "/admin";
        } else {
          navigate("/");
          window.location.reload();
        }
      } else {
        message.error("Giriş başarısız.");
      }
    } catch (err) {
      console.error("Login error:", err);
      message.error("Bir hata oluştu.");
    }
  };

  return (
    <div className="login-page">
      {/* SOL TARAF → FORM */}
      <div className="login-left">
        <div className="login-box">
          <div className="text-center">
            <img src="/logo/logo.png" alt="Logo" className="auth-logo" />
           
         
          </div>

          <form onSubmit={handleLogin}>
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

            <button type="submit" className="btn-login">
              GİRİŞ YAP
            </button>

            <a href="#" className="forgot-link">
              Şifrenizi mi unuttunuz?
            </a>
          </form>

          <div className="register-prompt">
            <span>Hesabınız yok mu?</span>
            <button
              type="button"
              className="btn-register"
              onClick={() => navigate("/register")}
            >
              KAYIT OL
            </button>
          </div>
        </div>
      </div>

      {/* SAĞ TARAF → GÖRSEL ALAN */}
      <div className="login-right login-visual">
        <div className="right-content">
          <h2>Sizi yeniden görmek harika!</h2>
          <p>
            Sizi burada tekrar görmek çok güzel. Kişisel hesap deneyiminize devam etmek için giriş yapın.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;