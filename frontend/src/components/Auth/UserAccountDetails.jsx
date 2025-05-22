import { useEffect, useState } from "react";
import { message } from "antd";
import "./UserAccountDetails.css";

const UserAccountDetails = () => {
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  const [showEdit, setShowEdit] = useState(false);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const storedUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/users/${storedUser._id}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setUserData(data);
        setFormData({
          username: data.username || "",
          email: data.email || "",
          password: "",
        });
      } catch (err) {
        message.error("Kullanıcı bilgileri alınamadı");
      }
    };

    if (storedUser?._id) {
      fetchUser();
    }
  }, [apiUrl, storedUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/users/${storedUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error();
      const updated = await res.json();
      localStorage.setItem("user", JSON.stringify(updated));
      setUserData(updated);
      setEditMode(false);
      message.success("Bilgiler güncellendi");
    } catch (err) {
      console.error(err);
      message.error("Güncelleme başarısız");
    } finally {
      setLoading(false);
    }
  };

  if (!userData) return <p>Yükleniyor...</p>;

  return (
    <div className="user-account-details">
      <button onClick={() => setShowInfo(!showInfo)} className="toggle-section">
        {showInfo ? "Temel Bilgileri Gizle" : "Temel Bilgileri Göster"}
      </button>

      {showInfo && (
        <div className="user-info-box">
          <p><strong>Kullanıcı Adı:</strong> {userData.username}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Üyelik Tarihi:</strong> {new Date(userData.createdAt).toLocaleDateString("tr-TR")}</p>
        </div>
      )}

      <button onClick={() => setShowEdit(!showEdit)} className="toggle-section">
        {showEdit ? "Güncellemeyi Gizle" : "Bilgileri Güncelle"}
      </button>

      {showEdit && (
        <div className="user-edit-box">
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

          <button
            className="update-button"
            onClick={handleUpdate}
            disabled={loading}
          >
            {loading ? "Güncelleniyor..." : "Kaydet"}
          </button>
        </div>
      )}
    </div>
  );
};

export default UserAccountDetails;