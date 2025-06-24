import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { message, Modal } from "antd";
import "./Login.css";

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

      const data = await response.json();

      if (response.ok) {
        const { token, user, emailVerified } = data;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        const redirectUser = () => {
          if (user.role === "admin") {
            window.location.href = "/admin";
          } else {
            navigate("/");
            window.location.reload();
          }
        };

        if (!emailVerified) {
          Modal.warning({
            title: "E-posta Doğrulaması Gerekli",
            content:
              "E-posta adresiniz henüz doğrulanmamış. Lütfen e-postanızı kontrol edin.",
            okText: "Tamam",
            onOk: redirectUser,
          });
        } else {
          message.success("Giriş başarılı.");
          redirectUser();
        }
      } else {
        message.error(
          data.error || "Giriş başarısız. Lütfen bilgilerinizi kontrol edin."
        );
      }
    } catch (err) {
      console.error("Login error:", err);
      message.error("Bir hata oluştu.");
    }
  };

  return (
    <div className="login-page">
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

            <a href="/forgot-password" className="forgot-link">
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

      <div className="login-right login-visual">
        <div className="right-content">
          <h2>Sizi yeniden görmek harika!</h2>
          <p>
            Sizi burada tekrar görmek çok güzel. Kişisel hesap deneyiminize
            devam etmek için giriş yapın.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
