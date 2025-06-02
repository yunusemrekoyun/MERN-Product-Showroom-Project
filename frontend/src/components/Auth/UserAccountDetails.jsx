// src/components/UserAccountDetails.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { message, Tabs } from "antd";
import imageCompression from "browser-image-compression";
import UserAccountFavProductItem from "../Products/UserAccountFavProductItem";

import "./UserAccountDetails.css";

const UserAccountDetails = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    avatar: null,
  });
  const [loading, setLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId =
    storedUser?._id || storedUser?.id || storedUser?._userId || null;

  useEffect(() => {
    if (!userId) {
      navigate("/login", { replace: true });
    }
  }, [userId, navigate]);

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/users/${userId}`);
        if (!res.ok) throw new Error("Fetch failed");
        const data = await res.json();
        setUserData(data);
        setFormData({
          username: data.username || "",
          email: data.email || "",
          password: "",
          avatar: null,
        });
        setEditMode(false);
      } catch (err) {
        console.error("❌ Kullanıcı bilgisi alınamadı:", err);
        message.error("Kullanıcı bilgileri alınamadı");
      }
    };

    fetchUser();
  }, [apiUrl, userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setEditMode(true);
  };

  const handleAvatarChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      avatar: e.target.files[0] || null,
    }));
    setEditMode(true);
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const form = new FormData();
      form.append("username", formData.username);
      form.append("email", formData.email);
      if (formData.password) form.append("password", formData.password);

      if (formData.avatar) {
        const compressed = await imageCompression(formData.avatar, {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 512,
          useWebWorker: true,
        });
        form.append("avatar", compressed);
      }

      const res = await fetch(`${apiUrl}/api/users/${userId}`, {
        method: "PUT",
        body: form,
      });
      if (!res.ok) throw new Error("Update failed");

      const updated = await res.json();
      localStorage.setItem("user", JSON.stringify(updated));
      setUserData(updated);
      setEditMode(false);
      message.success("Bilgiler güncellendi");
    } catch (err) {
      console.error("❌ Güncelleme hatası:", err);
      message.error("Güncelleme başarısız");
    } finally {
      setLoading(false);
    }
  };

  const removeFromFavorites = async (productId) => {
    try {
      const res = await fetch(
        `${apiUrl}/api/users/${userId}/favorites/${productId}`,
        {
          method: "POST",
        }
      );
      const data = await res.json();
      const updatedUser = {
        ...userData,
        favorites: userData.favorites.filter((p) => p._id !== productId),
      };
      setUserData(updatedUser);
      localStorage.setItem(
        "user",
        JSON.stringify({ ...storedUser, favorites: data.favorites })
      );
    } catch (err) {
      message.error("Favoriden kaldırılamadı.");
    }
  };

  if (!userId) return null;
  if (!userData) return <p>Yükleniyor...</p>;

  const items = [
    {
      key: "1",
      label: "Hesap Bilgileri",
      children: (
        <div className="user-account-details">
          <div className="user-account-header">
            <div className="user-avatar-large">
              <img
                src={`${apiUrl}/api/users/${userId}/image`}
                alt="Avatar"
                onError={(e) => {
                  e.currentTarget.src = "/img/avatars/avatar1.jpg";
                }}
              />
            </div>
            <div className="user-form-section">
              <div className="form-group">
                <label>Kullanıcı Adı</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Email Adresi</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Yeni Şifre</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Boş bırakırsan şifre değişmez"
                />
              </div>

              <div className="form-group">
                <label>Profil Fotoğrafı</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </div>

              {editMode && (
                <p className="edit-warning">
                  Değişiklik yapıldı. Lütfen kaydedin.
                </p>
              )}

              <button
                className="update-button"
                onClick={handleUpdate}
                disabled={loading || !editMode}
              >
                {loading ? "Güncelleniyor..." : "Kaydet"}
              </button>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "2",
      label: "Favori Ürünler",
      children: (
        <div className="fav-products-grid">
          {userData?.favorites?.map((product) => (
            <UserAccountFavProductItem
              key={product._id}
              product={product}
              onRemove={removeFromFavorites}
            />
          ))}
        </div>
      ),
    },
    {
      key: "3",
      label: "Beğenilen İçerikler",
      children: (
        <ul className="static-list">
          <li>Samsung Galaxy Watch</li>
          <li>Logitech MX Master 3</li>
          <li>Amazon Kindle Paperwhite</li>
        </ul>
      ),
    },
  ];

  return (
    <div className="user-account-wrapper">
      <Tabs defaultActiveKey="1" centered items={items} />
    </div>
  );
};

export default UserAccountDetails;