import { useEffect, useState } from "react";
import { message, Tabs } from "antd";
import imageCompression from "browser-image-compression";
import "./UserAccountDetails.css";

const { TabPane } = Tabs;

const UserAccountDetails = () => {
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
  const userId = storedUser?._id || storedUser?.id || storedUser?._userId;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/users/${userId}`);
        if (!res.ok) throw new Error();
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

    if (userId) {
      fetchUser();
    }
  }, [apiUrl, userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

      if (!res.ok) throw new Error();
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

  if (!userData) return <p>Yükleniyor...</p>;

  return (
    <div className="user-account-wrapper">
      <Tabs defaultActiveKey="1" centered>
        <TabPane tab="Hesap Bilgileri" key="1">
          <div className="user-account-details">
            <div className="user-account-header">
              <div className="user-avatar-large">
                <img
                  src={
                    userId
                      ? `${apiUrl}/api/users/${userId}/image`
                      : "/img/avatars/avatar1.jpg"
                  }
                  alt="Avatar"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/img/avatars/avatar1.jpg";
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
        </TabPane>
        <TabPane tab="İstek Listesi" key="2">
          <ul className="static-list">
            <li>iPhone 15 Pro Max</li>
            <li>PlayStation 5</li>
            <li>MacBook Air M3</li>
          </ul>
        </TabPane>
        <TabPane tab="Beğenilenler" key="3">
          <ul className="static-list">
            <li>Samsung Galaxy Watch</li>
            <li>Logitech MX Master 3</li>
            <li>Amazon Kindle Paperwhite</li>
          </ul>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default UserAccountDetails;
